"use client"

import { useState } from "react"
import {
  ChevronRight,
  Folder,
  FileText,
  ImageIcon,
  Video,
  MoreVertical,
  Download,
  Share,
  Star,
  Trash2,
  Plus,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

const breadcrumbs = [
  { name: "My Drive", href: "/" },
  { name: "Documents", href: "/documents" },
]

const files = [
  {
    id: 1,
    name: "Project Proposal.docx",
    type: "document",
    size: "2.4 MB",
    modified: "2 hours ago",
    icon: FileText,
  },
  {
    id: 2,
    name: "Design Assets",
    type: "folder",
    size: "12 items",
    modified: "1 day ago",
    icon: Folder,
  },
  {
    id: 3,
    name: "Screenshot 2024.png",
    type: "image",
    size: "1.8 MB",
    modified: "3 days ago",
    icon: ImageIcon,
  },
  {
    id: 4,
    name: "Meeting Recording.mp4",
    type: "video",
    size: "45.2 MB",
    modified: "1 week ago",
    icon: Video,
  },
  {
    id: 5,
    name: "Budget Spreadsheet.xlsx",
    type: "document",
    size: "892 KB",
    modified: "2 weeks ago",
    icon: FileText,
  },
  {
    id: 6,
    name: "Client Feedback",
    type: "folder",
    size: "8 items",
    modified: "3 weeks ago",
    icon: Folder,
  },
]

export function MainContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-1 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.name} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
              <button
                className={`hover:text-gray-900 ${
                  index === breadcrumbs.length - 1 ? "text-gray-900 font-medium" : "hover:underline"
                }`}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">My Drive</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="hidden sm:flex"
            >
              {viewMode === "grid" ? "List view" : "Grid view"}
            </Button>
          </div>
        </div>

        {/* File Grid */}
        <div
          className={`grid gap-4 ${
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {files.map((file) => (
            <Card
              key={file.id}
              className="group hover:shadow-md transition-all duration-200 cursor-pointer border-gray-200 hover:border-gray-300"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      file.type === "folder"
                        ? "bg-blue-50 text-blue-600"
                        : file.type === "image"
                          ? "bg-green-50 text-green-600"
                          : file.type === "video"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <file.icon className="h-6 w-6" />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="h-4 w-4 mr-2" />
                        Add to starred
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Move to trash
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 truncate" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{file.size}</span>
                    <span>{file.modified}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {files.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <Folder className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
            <p className="text-gray-500 mb-4">Upload your first file to get started</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Upload files
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile) */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg lg:hidden"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Upload files</span>
      </Button>
    </main>
  )
}
