"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppSidebar } from "~/components/app-sidebar";
import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";

function DrivePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Handle URL parameters for folder navigation
  useEffect(() => {
    const folderParam = searchParams.get("folder");
    if (folderParam) {
      setCurrentFolderId(folderParam);
    } else {
      setCurrentFolderId(null);
    }
  }, [searchParams]);

  const handleFolderSelect = useCallback(
    (folderId: string | null) => {
      setCurrentFolderId(folderId);

      // Update URL to reflect the current folder
      if (folderId) {
        router.push(`/?folder=${folderId}`, { scroll: false });
      } else {
        router.push("/", { scroll: false });
      }
    },
    [router],
  );

  // Handle navigation from search results
  const handleSearchNavigation = useCallback(
    (folderId: string | null) => {
      setCurrentFolderId(folderId);

      // Update URL to reflect the current folder
      if (folderId) {
        router.push(`/?folder=${folderId}`, { scroll: false });
      } else {
        router.push("/", { scroll: false });
      }
    },
    [router],
  );

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gray-50 transition-all duration-300 ease-in-out">
        <AppSidebar
          currentFolderId={currentFolderId}
          onFolderSelect={handleFolderSelect}
        />
        <SidebarInset className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
          <Header onSearchNavigation={handleSearchNavigation} />
          <MainContent
            currentFolderId={currentFolderId}
            onFolderSelect={handleFolderSelect}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function DrivePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading Drive...</p>
          </div>
        </div>
      }
    >
      <DrivePageContent />
    </Suspense>
  );
}
