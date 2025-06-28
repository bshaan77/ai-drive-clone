"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface ItemSelection {
  selectedFiles: Set<string>;
  selectedFolders: Set<string>;
  isAllSelected: boolean;
}

export function useItemSelection(fileIds: string[], folderIds: string[]) {
  const [selection, setSelection] = useState<ItemSelection>({
    selectedFiles: new Set<string>(),
    selectedFolders: new Set<string>(),
    isAllSelected: false,
  });

  // Use ref to track selected count to avoid infinite loops
  const selectedCountRef = useRef(0);

  // Update isAllSelected when selection changes
  useEffect(() => {
    const totalItems = fileIds.length + folderIds.length;
    const selectedCount =
      selection.selectedFiles.size + selection.selectedFolders.size;
    selectedCountRef.current = selectedCount;

    const isAllSelected = totalItems > 0 && selectedCount === totalItems;

    setSelection((prev) => {
      // Only update if the isAllSelected value actually changed
      if (prev.isAllSelected !== isAllSelected) {
        return { ...prev, isAllSelected };
      }
      return prev;
    });
  }, [
    fileIds.length,
    folderIds.length,
    selection.selectedFiles.size,
    selection.selectedFolders.size,
  ]);

  const handleFileSelect = useCallback((fileId: string, selected: boolean) => {
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

  const handleFolderSelect = useCallback(
    (folderId: string, selected: boolean) => {
      setSelection((prev) => {
        const newSelectedFolders = new Set<string>(prev.selectedFolders);
        if (selected) {
          newSelectedFolders.add(folderId);
        } else {
          newSelectedFolders.delete(folderId);
        }
        return {
          ...prev,
          selectedFolders: newSelectedFolders,
        };
      });
    },
    [],
  );

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      setSelection((prev) => ({
        ...prev,
        selectedFiles: selected ? new Set<string>(fileIds) : new Set<string>(),
        selectedFolders: selected
          ? new Set<string>(folderIds)
          : new Set<string>(),
        isAllSelected: selected,
      }));
    },
    [fileIds, folderIds],
  );

  const clearSelection = useCallback(() => {
    setSelection({
      selectedFiles: new Set<string>(),
      selectedFolders: new Set<string>(),
      isAllSelected: false,
    });
  }, []);

  return {
    selection,
    handleFileSelect,
    handleFolderSelect,
    handleSelectAll,
    clearSelection,
  };
}
