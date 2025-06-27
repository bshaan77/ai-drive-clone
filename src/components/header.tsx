"use client"

import { Search, Bell, Grid3X3 } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { Badge } from "~/components/ui/badge"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <SidebarTrigger className="h-8 w-8 text-gray-600 hover:bg-gray-100" />

        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search in Drive"
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600 hover:bg-gray-100">
            <Grid3X3 className="h-5 w-5" />
            <span className="sr-only">Grid view</span>
          </Button>

          <div className="relative">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs text-white">3</Badge>
          </div>

          {/* Placeholder for Clerk UserButton */}
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">U</span>
          </div>
        </div>
      </div>
    </header>
  )
}
