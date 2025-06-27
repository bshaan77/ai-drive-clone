"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppSidebar } from "~/components/app-sidebar";
import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";

export default function DrivePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

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
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar
          currentFolderId={currentFolderId}
          onFolderSelect={handleFolderSelect}
        />
        <SidebarInset className="flex flex-1 flex-col">
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
