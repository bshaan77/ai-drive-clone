"use client";

import {
  Clock,
  Home,
  Star,
  Trash2,
  Users,
  HardDrive,
  Plus,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { FolderTree } from "~/components/folder-tree";

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
    title: "Shared with me",
    url: "/shared",
    icon: Users,
  },
  {
    title: "Recent",
    url: "/recent",
    icon: Clock,
  },
  {
    title: "Starred",
    url: "/starred",
    icon: Star,
  },
  {
    title: "Trash",
    url: "/trash",
    icon: Trash2,
  },
];

export function AppSidebar({
  currentFolderId,
  onFolderSelect,
}: AppSidebarProps) {
  const storageUsed = 8.2; // GB
  const storageTotal = 15; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <HardDrive className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Drive</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="mb-4 px-2">
              <Button className="w-full justify-start gap-3 bg-blue-600 text-white shadow-sm hover:bg-blue-700">
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
                    className="h-10 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 data-[active=true]:bg-blue-50 data-[active=true]:font-medium data-[active=true]:text-blue-700"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
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
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Storage</span>
            <span className="font-medium text-gray-900">
              {storageUsed} GB of {storageTotal} GB used
            </span>
          </div>
          <Progress value={storagePercentage} className="h-2" />
          <Button
            variant="outline"
            size="sm"
            className="w-full border-blue-200 bg-transparent text-blue-600 hover:bg-blue-50"
          >
            Get more storage
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
