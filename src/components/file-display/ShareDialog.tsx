/**
 * Share Dialog Component
 *
 * Provides a dialog for sharing files and folders with users
 * Supports user lookup, permission selection, and public link creation
 */

"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Share2, User, Link, Eye, Edit, X, Search } from "lucide-react";
import { cn } from "~/lib/utils";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (data: {
    users: Array<{ id: string; permission: "view" | "edit" }>;
    createPublicLink: boolean;
    publicPermission: "view" | "edit";
  }) => Promise<{ publicLink?: { url: string } } | void>;
  itemName: string;
  itemType: "file" | "folder";
  currentShares?: Array<{
    user: User;
    permission: "view" | "edit";
  }>;
  itemId: string;
}

export function ShareDialog({
  isOpen,
  onClose,
  onShare,
  itemName,
  itemType,
  currentShares = [],
  itemId,
}: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<
    Array<{
      user: User;
      permission: "view" | "edit";
    }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createPublicLink, setCreatePublicLink] = useState(false);
  const [publicPermission, setPublicPermission] = useState<"view" | "edit">(
    "view",
  );
  const [generatedPublicLink, setGeneratedPublicLink] = useState<string | null>(
    null,
  );

  // Search for users by email
  const searchUsers = useCallback(async (searchEmail: string) => {
    if (!searchEmail.trim() || searchEmail.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      const response = await fetch(
        `/api/users/search?email=${encodeURIComponent(searchEmail)}`,
      );
      if (response.ok) {
        const data = (await response.json()) as { users?: User[] };
        setSearchResults(data.users ?? []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle email input change with debouncing
  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (value.trim()) {
        setTimeout(() => void searchUsers(value), 300);
      } else {
        setSearchResults([]);
      }
    },
    [searchUsers],
  );

  // Add user to selected list
  const addUser = useCallback(
    (user: User) => {
      const isAlreadySelected = selectedUsers.some(
        (su) => su.user.id === user.id,
      );
      if (!isAlreadySelected) {
        setSelectedUsers((prev) => [...prev, { user, permission: "view" }]);
      }
      setEmail("");
      setSearchResults([]);
    },
    [selectedUsers],
  );

  // Remove user from selected list
  const removeUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => prev.filter((su) => su.user.id !== userId));
  }, []);

  // Update user permission
  const updateUserPermission = useCallback(
    (userId: string, permission: "view" | "edit") => {
      setSelectedUsers((prev) =>
        prev.map((su) => (su.user.id === userId ? { ...su, permission } : su)),
      );
    },
    [],
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUsers.length === 0 && !createPublicLink) {
      setError("Please select at least one user or create a public link");
      return;
    }

    try {
      setIsSharing(true);
      setError(null);

      const result = await onShare({
        users: selectedUsers.map((su) => ({
          id: su.user.id,
          permission: su.permission,
        })),
        createPublicLink,
        publicPermission,
      });

      // If a public link was created, store it for copying and auto-copy it
      if (
        createPublicLink &&
        result &&
        typeof result === "object" &&
        "publicLink" in result
      ) {
        const response = result as { publicLink?: { url: string } };
        if (response.publicLink?.url) {
          setGeneratedPublicLink(response.publicLink.url);
          // Auto-copy the link to clipboard
          try {
            await navigator.clipboard.writeText(response.publicLink.url);
            // Show success message
            setError(null);
            // Note: We could add a success state here if needed
          } catch (copyError) {
            console.error("Auto-copy failed:", copyError);
            setError("Link created but failed to copy to clipboard");
          }
        }
      }

      // Reset form
      setSelectedUsers([]);
      setEmail("");
      setSearchResults([]);
      setCreatePublicLink(false);
      setPublicPermission("view");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share item");
    } finally {
      setIsSharing(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setSelectedUsers([]);
    setEmail("");
    setSearchResults([]);
    setError(null);
    setCreatePublicLink(false);
    setPublicPermission("view");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share {itemType}
          </DialogTitle>
          <DialogDescription>
            Share &ldquo;{itemName}&rdquo; with specific users or create a
            public link
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Shares */}
          {currentShares.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Currently shared with
              </Label>
              <div className="space-y-2">
                {currentShares.map((share) => (
                  <div
                    key={share.user.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {share.user.firstName && share.user.lastName
                            ? `${share.user.firstName} ${share.user.lastName}`
                            : share.user.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {share.user.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {share.permission}
                    </Badge>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          )}

          {/* Add People */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Add people
            </Label>
            <div className="space-y-2">
              <Input
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Enter email address"
                disabled={isSharing}
                className="w-full"
              />

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => addUser(user)}
                      className="w-full border-b border-gray-100 p-3 text-left last:border-b-0 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.email}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {isSearching && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Search className="h-4 w-4 animate-pulse" />
                  Searching...
                </div>
              )}
            </div>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                People to share with
              </Label>
              <div className="space-y-2">
                {selectedUsers.map((selectedUser) => (
                  <div
                    key={selectedUser.user.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedUser.user.firstName &&
                          selectedUser.user.lastName
                            ? `${selectedUser.user.firstName} ${selectedUser.user.lastName}`
                            : selectedUser.user.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedUser.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={selectedUser.permission}
                        onValueChange={(value: "view" | "edit") =>
                          updateUserPermission(selectedUser.user.id, value)
                        }
                      >
                        <SelectTrigger className="h-8 w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">
                            <div className="flex items-center gap-2">
                              <Eye className="h-3 w-3" />
                              View
                            </div>
                          </SelectItem>
                          <SelectItem value="edit">
                            <div className="flex items-center gap-2">
                              <Edit className="h-3 w-3" />
                              Edit
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUser(selectedUser.user.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Public Link Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Create public link
              </Label>
              <Switch
                checked={createPublicLink}
                onCheckedChange={setCreatePublicLink}
                disabled={isSharing}
              />
            </div>

            {createPublicLink && (
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Anyone with the link can access
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={publicPermission}
                    onValueChange={(value: "view" | "edit") =>
                      setPublicPermission(value)
                    }
                  >
                    <SelectTrigger className="h-8 w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">
                        <div className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </div>
                      </SelectItem>
                      <SelectItem value="edit">
                        <div className="flex items-center gap-2">
                          <Edit className="h-3 w-3" />
                          Edit
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
              <span className="text-sm">{error}</span>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSharing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSharing || (selectedUsers.length === 0 && !createPublicLink)
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSharing
                ? "Sharing..."
                : createPublicLink
                  ? "Share & Copy Link"
                  : "Share"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
