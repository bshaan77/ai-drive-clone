/**
 * Keyboard Shortcuts Hook
 *
 * Provides keyboard shortcuts for common actions in the Drive application
 */

import { useEffect, useCallback } from "react";

interface KeyboardShortcutsProps {
  onUpload?: () => void;
  onNewFolder?: () => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onSearch?: () => void;
  onDelete?: () => void;
  onRename?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function useKeyboardShortcuts({
  onUpload,
  onNewFolder,
  onSelectAll,
  onClearSelection,
  onSearch,
  onDelete,
  onRename,
  onCopy,
  onPaste,
  onUndo,
  onRedo,
}: KeyboardShortcutsProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      const { key, ctrlKey, metaKey, shiftKey, altKey } = event;

      // Ctrl/Cmd + N: New folder
      if ((ctrlKey || metaKey) && key === "n" && !shiftKey && !altKey) {
        event.preventDefault();
        onNewFolder?.();
        return;
      }

      // Ctrl/Cmd + U: Upload files
      if ((ctrlKey || metaKey) && key === "u" && !shiftKey && !altKey) {
        event.preventDefault();
        onUpload?.();
        return;
      }

      // Ctrl/Cmd + A: Select all
      if ((ctrlKey || metaKey) && key === "a" && !shiftKey && !altKey) {
        event.preventDefault();
        onSelectAll?.();
        return;
      }

      // Escape: Clear selection
      if (key === "Escape" && !ctrlKey && !metaKey && !shiftKey && !altKey) {
        event.preventDefault();
        onClearSelection?.();
        return;
      }

      // Ctrl/Cmd + K: Search
      if ((ctrlKey || metaKey) && key === "k" && !shiftKey && !altKey) {
        event.preventDefault();
        onSearch?.();
        return;
      }

      // Delete or Backspace: Delete selected items
      if (
        (key === "Delete" || key === "Backspace") &&
        !ctrlKey &&
        !metaKey &&
        !shiftKey &&
        !altKey
      ) {
        event.preventDefault();
        onDelete?.();
        return;
      }

      // F2: Rename
      if (key === "F2" && !ctrlKey && !metaKey && !shiftKey && !altKey) {
        event.preventDefault();
        onRename?.();
        return;
      }

      // Ctrl/Cmd + C: Copy
      if ((ctrlKey || metaKey) && key === "c" && !shiftKey && !altKey) {
        event.preventDefault();
        onCopy?.();
        return;
      }

      // Ctrl/Cmd + V: Paste
      if ((ctrlKey || metaKey) && key === "v" && !shiftKey && !altKey) {
        event.preventDefault();
        onPaste?.();
        return;
      }

      // Ctrl/Cmd + Z: Undo
      if ((ctrlKey || metaKey) && key === "z" && !shiftKey && !altKey) {
        event.preventDefault();
        onUndo?.();
        return;
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if (
        ((ctrlKey || metaKey) && key === "z" && shiftKey && !altKey) ||
        ((ctrlKey || metaKey) && key === "y" && !shiftKey && !altKey)
      ) {
        event.preventDefault();
        onRedo?.();
        return;
      }
    },
    [
      onUpload,
      onNewFolder,
      onSelectAll,
      onClearSelection,
      onSearch,
      onDelete,
      onRename,
      onCopy,
      onPaste,
      onUndo,
      onRedo,
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return a function to manually trigger shortcuts (useful for testing)
  return {
    triggerShortcut: (shortcut: string) => {
      const event = new KeyboardEvent("keydown", {
        key: shortcut.toLowerCase(),
        ctrlKey: shortcut.includes("Ctrl"),
        metaKey: shortcut.includes("Cmd"),
        shiftKey: shortcut.includes("Shift"),
        altKey: shortcut.includes("Alt"),
      });
      handleKeyDown(event);
    },
  };
}
