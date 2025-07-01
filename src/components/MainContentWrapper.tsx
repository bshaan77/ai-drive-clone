"use client";
import { useState, useCallback } from "react";
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";
import { MainContent } from "./main-content";
import { SidebarProvider, SidebarInset } from "./ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";

/**
 * MainContentWrapper
 *
 * Client component that manages folder navigation state and renders the full Drive layout:
 * - Sidebar
 * - Header (with search)
 * - Main content area
 */
export function MainContentWrapper() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const isMobile = useIsMobile();

  const handleFolderSelect = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId);
  }, []);

  const handleCreateFolder = useCallback(() => {
    setShowCreateFolderDialog(true);
  }, []);

  const handleUploadFiles = useCallback(() => {
    setShowUploadModal(true);
  }, []);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gray-50 transition-all duration-300 ease-in-out">
        <AppSidebar
          currentFolderId={currentFolderId}
          onFolderSelect={handleFolderSelect}
          onCreateFolder={handleCreateFolder}
          onUploadFiles={handleUploadFiles}
        />
        <SidebarInset className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
          <Header /* onSearchNavigation={...} */ />
          <MainContent
            currentFolderId={currentFolderId}
            onFolderSelect={handleFolderSelect}
            showCreateFolderDialog={showCreateFolderDialog}
            setShowCreateFolderDialog={setShowCreateFolderDialog}
            showUploadModal={showUploadModal}
            setShowUploadModal={setShowUploadModal}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
