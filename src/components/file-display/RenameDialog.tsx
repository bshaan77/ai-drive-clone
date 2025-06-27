/**
 * File Rename Dialog Component
 *
 * Provides a dialog interface for renaming files with validation
 * and error handling.
 */

"use client";

import { useState, useEffect } from "react";
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
import { AlertCircle, Loader2 } from "lucide-react";
import type { FileRecord } from "~/types/file";

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileRecord | null;
  onRename: (fileId: string, newName: string) => Promise<void>;
}

export function RenameDialog({
  isOpen,
  onClose,
  file,
  onRename,
}: RenameDialogProps) {
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen && file) {
      setNewName(file.name);
      setError(null);
    } else {
      setNewName("");
      setError(null);
    }
  }, [isOpen, file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const trimmedName = newName.trim();

    // Validation
    if (!trimmedName) {
      setError("File name cannot be empty");
      return;
    }

    if (trimmedName === file.name) {
      onClose();
      return;
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(trimmedName)) {
      setError("File name contains invalid characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onRename(file.id, trimmedName);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
          <DialogDescription>
            Enter a new name for &quot;{file.originalName}&quot;
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filename">File name</Label>
              <Input
                id="filename"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter file name"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !newName.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
