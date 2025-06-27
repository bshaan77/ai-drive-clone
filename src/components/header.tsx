"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Bell, Grid3X3, Search, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Badge } from "~/components/ui/badge";
import { SearchBar } from "~/components/search-bar";

interface HeaderProps {
  onSearchNavigation?: (folderId: string | null) => void;
}

export function Header({ onSearchNavigation }: HeaderProps) {
  const handleSearchResultSelect = (result: {
    id: string;
    name: string;
    type: "file" | "folder";
    path?: string;
  }) => {
    console.log("Header search result selected:", result);

    if (result.type === "folder") {
      // Navigate to the folder by updating the URL
      onSearchNavigation?.(result.id);
    } else {
      // For files, navigate to the folder containing the file
      // We need to extract the folder ID from the file's path or metadata
      // For now, we'll need to fetch the file's folder ID
      void handleFileSelection(result.id);
    }
  };

  const handleFileSelection = async (fileId: string) => {
    try {
      // Fetch the file details to get its folder ID
      const response = await fetch(`/api/files/${fileId}`);
      if (response.ok) {
        const data = (await response.json()) as {
          success: boolean;
          file?: {
            id: string;
            name: string;
            folderId?: string;
          };
          error?: string;
        };
        if (data.success && data.file) {
          const folderId = data.file.folderId;
          if (folderId) {
            // Navigate to the folder containing the file
            onSearchNavigation?.(folderId);
            console.log(
              `Navigating to folder ${folderId} containing file ${data.file.name}`,
            );
          } else {
            // File is in root, navigate to root
            onSearchNavigation?.(null);
            console.log(`File ${data.file.name} is in root folder`);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching file details:", error);
      // Fallback: navigate to root
      onSearchNavigation?.(null);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <SidebarTrigger className="h-8 w-8 text-gray-600 hover:bg-gray-100" />

        <div className="flex flex-1 items-center gap-4">
          <div className="relative max-w-2xl flex-1">
            <SearchBar
              onResultSelect={handleSearchResultSelect}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-600 hover:bg-gray-100"
          >
            <Grid3X3 className="h-5 w-5" />
            <span className="sr-only">Grid view</span>
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-600 hover:bg-gray-100"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs text-white">
              3
            </Badge>
          </div>

          {/* Placeholder for Clerk UserButton */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
            <span className="text-sm font-medium text-white">U</span>
          </div>
        </div>
      </div>
    </header>
  );
}
