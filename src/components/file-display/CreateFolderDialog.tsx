/**
 * Create Folder Dialog Component
 *
 * Provides a dialog for creating new folders with name input
 */

"use client";

import { useState } from "react";
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
import { Folder } from "lucide-react";

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string) => Promise<void>;
  currentPath?: string;
}

export function CreateFolderDialog({
  isOpen,
  onClose,
  onCreateFolder,
  currentPath,
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    if (folderName.length > 255) {
      setError("Folder name must be less than 255 characters");
      return;
    }

    // Basic validation for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(folderName)) {
      setError("Folder name contains invalid characters");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      await onCreateFolder(folderName.trim());
      setFolderName("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create folder");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFolderName("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Create new folder
          </DialogTitle>
          <DialogDescription>
            {currentPath
              ? `Create a new folder in "${currentPath}"`
              : "Create a new folder in the current location"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              autoFocus
              disabled={isCreating}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !folderName.trim()}>
              {isCreating ? "Creating..." : "Create folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
