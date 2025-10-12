"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { name: "Dashboard", icon: "📊", path: "/adminDashboard/dashboard" },
  { name: "Manage Projects", icon: "⚙️", path: "/adminDashboard/manage-projects" },
  { name: "Projects", icon: "📁", path: "/adminDashboard/projects" },
  { name: "Chat", icon: "💬", path: "/adminDashboard/chat" },
  { name: "Documents", icon: "📄", path: "/adminDashboard/documents" },
  { name: "Clients", icon: "👥", path: "/adminDashboard/clients" },
  { name: "Profile", icon: "👤", path: "/adminDashboard/profile" },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="w-48 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo/Brand */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-sidebar-foreground">Tech Solutions</h1>
        <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1 text-sidebar-foreground hover:bg-sidebar-accent",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Button>
          )
        })}
      </nav>

      {/* System Status */}
      <div className="p-2 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60 mb-2">System Status</div>
        <Badge variant="default" className="w-full justify-center bg-green-600">
          All Systems Online ✓
        </Badge>
      </div>
    </div>
  )
}
