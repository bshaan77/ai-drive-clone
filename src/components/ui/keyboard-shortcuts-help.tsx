/**
 * Keyboard Shortcuts Help Component
 *
 * Displays available keyboard shortcuts in a modal or tooltip
 */

"use client";

import { useState } from "react";
import { Keyboard, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";

interface Shortcut {
  key: string;
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // File Operations
  {
    key: "Ctrl/Cmd + U",
    description: "Upload files",
    category: "File Operations",
  },
  {
    key: "Ctrl/Cmd + N",
    description: "New folder",
    category: "File Operations",
  },
  {
    key: "F2",
    description: "Rename selected item",
    category: "File Operations",
  },
  {
    key: "Delete/Backspace",
    description: "Delete selected items",
    category: "File Operations",
  },

  // Selection
  { key: "Ctrl/Cmd + A", description: "Select all", category: "Selection" },
  { key: "Escape", description: "Clear selection", category: "Selection" },

  // Navigation & Search
  {
    key: "Ctrl/Cmd + K",
    description: "Search files and folders",
    category: "Navigation",
  },

  // Edit Operations
  { key: "Ctrl/Cmd + C", description: "Copy selected items", category: "Edit" },
  { key: "Ctrl/Cmd + V", description: "Paste items", category: "Edit" },
  { key: "Ctrl/Cmd + Z", description: "Undo", category: "Edit" },
  { key: "Ctrl/Cmd + Shift + Z", description: "Redo", category: "Edit" },
];

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      const arr = (acc[shortcut.category] ??= []);
      arr.push(shortcut);
      return acc;
    },
    {} as Record<string, Shortcut[]>,
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-gray-600 hover:text-gray-900"
        >
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">Keyboard shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and manage your files more
            efficiently.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(
            ([category, categoryShortcuts]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
                  {category}
                </h3>
                <div className="grid gap-3">
                  {categoryShortcuts.map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      <span className="text-sm text-gray-700">
                        {shortcut.description}
                      </span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Keyboard shortcuts work when you&apos;re not
            typing in input fields. Use Escape to clear any selection or close
            dialogs.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
