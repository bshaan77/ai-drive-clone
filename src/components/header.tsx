"use client";

import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { SearchBar } from "./search-bar";
import { KeyboardShortcutsHelp } from "~/components/ui/keyboard-shortcuts-help";

interface HeaderProps {
  onSearchNavigation?: (folderId: string | null) => void;
}

export function Header({ onSearchNavigation }: HeaderProps) {
  // const isMobile = useIsMobile(); // Not needed anymore

  const handleSearchResultSelect = (result: {
    id: string;
    name: string;
    type: "file" | "folder";
    path?: string;
  }) => {
    if (result.type === "folder") onSearchNavigation?.(result.id);
    else void handleFileSelection(result.id);
  };

  const handleFileSelection = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`);
      if (response.ok) {
        const data = (await response.json()) as {
          success: boolean;
          file?: { id: string; name: string; folderId?: string };
          error?: string;
        };
        if (data.success && data.file) {
          const folderId = data.file.folderId;
          onSearchNavigation?.(folderId ?? null);
        }
      }
    } catch {
      onSearchNavigation?.(null);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur transition-all duration-300 ease-in-out supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-4 sm:px-4 lg:px-6">
        <SidebarTrigger className="h-8 w-8 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900" />
        <div className="flex flex-1 items-center gap-2 sm:gap-4">
          <div className="relative max-w-2xl flex-1 transition-all duration-300">
            <SearchBar
              onResultSelect={handleSearchResultSelect}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <KeyboardShortcutsHelp />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  );
}
