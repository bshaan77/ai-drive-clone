"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface FileSelection {
  selectedFiles: Set<string>;
  isAllSelected: boolean;
}

export function useFileSelection(fileIds: string[]) {
  const [selection, setSelection] = useState<FileSelection>({
    selectedFiles: new Set<string>(),
    isAllSelected: false,
  });

  // Use ref to track selected count to avoid infinite loops
  const selectedCountRef = useRef(0);

  // Update isAllSelected when selection changes
  useEffect(() => {
    const selectedCount = selection.selectedFiles.size;
    selectedCountRef.current = selectedCount;

    const isAllSelected =
      fileIds.length > 0 && selectedCount === fileIds.length;

    setSelection((prev) => {
      // Only update if the isAllSelected value actually changed
      if (prev.isAllSelected !== isAllSelected) {
        return { ...prev, isAllSelected };
      }
      return prev;
    });
  }, [fileIds.length, selection.selectedFiles.size]);

  const handleSelect = useCallback((fileId: string, selected: boolean) => {
    setSelection((prev) => {
      const newSelectedFiles = new Set<string>(prev.selectedFiles);
      if (selected) {
        newSelectedFiles.add(fileId);
      } else {
        newSelectedFiles.delete(fileId);
      }
      return {
        ...prev,
        selectedFiles: newSelectedFiles,
      };
    });
  }, []);

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      setSelection((prev) => ({
        ...prev,
        selectedFiles: selected ? new Set<string>(fileIds) : new Set<string>(),
        isAllSelected: selected,
      }));
    },
    [fileIds],
  );

  const clearSelection = useCallback(() => {
    setSelection({
      selectedFiles: new Set<string>(),
      isAllSelected: false,
    });
  }, []);

  return {
    selection,
    handleSelect,
    handleSelectAll,
    clearSelection,
  };
}
