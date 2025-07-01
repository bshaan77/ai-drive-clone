"use client";

import { useState, useCallback } from "react";
import { BarChart3, Users, HardDrive, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
  SidebarFooter,
} from "~/components/ui/sidebar";
import { FolderTree } from "./folder-tree";
import { SharedItemsTree } from "./folder-tree/SharedItemsTree";
import { Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import { Progress } from "~/components/ui/progress";

interface AppSidebarProps {
  currentFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

const navigationItems = [
  {
    title: "My Drive",
    url: "/",
    icon: Home,
    isActive: true,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Shared with me",
    url: "/shared-with-me",
    icon: Users,
  },
];

export function AppSidebar({
  currentFolderId,
  onFolderSelect,
}: AppSidebarProps) {
  const [storageUsed, setStorageUsed] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const storageTotal = 15; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;
  const isMobile = useIsMobile();

  // Fetch real storage data
  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        const response = await fetch("/api/files");
        const data = (await response.json()) as {
          success: boolean;
          files?: Array<{ size: number }>;
          error?: string;
        };

        if (response.ok && data.success && data.files) {
          const totalSize = data.files.reduce(
            (sum, file) => sum + file.size,
            0,
          );
          const usedGB = totalSize / (1024 * 1024 * 1024); // Convert bytes to GB
          setStorageUsed(usedGB);
          setTotalFiles(data.files.length);
        }
      } catch (error) {
        console.error("Failed to fetch storage data:", error);
      }
    };

    void fetchStorageData();
  }, []);

  return (
    <Sidebar className="border-r border-gray-200 transition-all duration-300 ease-in-out">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
            <HardDrive className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Drive</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="mb-4 px-2">
              <Button className="w-full justify-start gap-3 bg-blue-600 text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="h-10 px-3 text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 data-[active=true]:bg-blue-50 data-[active=true]:font-medium data-[active=true]:text-blue-700"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Folder Tree */}
        <SidebarSeparator className="my-4" />
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-2 py-2">
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Folders
              </h3>
              <FolderTree
                currentFolderId={currentFolderId}
                onFolderSelect={onFolderSelect}
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Shared Items */}
        <SidebarSeparator className="my-4" />
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-2 py-2">
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Shared
              </h3>
              <SharedItemsTree />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Storage</span>
            <span className="font-medium text-gray-900">
              {storageUsed.toFixed(1)} GB of {storageTotal} GB used
            </span>
          </div>
          <Progress
            value={storagePercentage}
            className="h-2 transition-all duration-300"
          />
          <div className="text-center text-xs text-gray-500">
            {totalFiles} files stored
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
