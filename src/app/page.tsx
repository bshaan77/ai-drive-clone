import { AppSidebar } from "~/components/app-sidebar"
import { Header } from "~/components/header"
import { MainContent } from "~/components/main-content"
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar"

export default function DrivePage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <Header />
          <MainContent />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
