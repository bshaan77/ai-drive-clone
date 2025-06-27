"use client";

import { useState, useCallback } from "react";
import { AppSidebar } from "~/components/app-sidebar";
import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";

export default function DrivePage() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const handleFolderSelect = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId);
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar
          currentFolderId={currentFolderId}
          onFolderSelect={handleFolderSelect}
        />
        <SidebarInset className="flex flex-1 flex-col">
          <Header />
          <MainContent
            currentFolderId={currentFolderId}
            onFolderSelect={handleFolderSelect}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
