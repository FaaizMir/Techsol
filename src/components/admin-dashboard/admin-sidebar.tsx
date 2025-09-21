import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { name: "Dashboard", icon: "📊", active: false },
  { name: "Projects", icon: "📁", active: false },
  { name: "Chat", icon: "💬", active: true },
  { name: "Documents", icon: "📄", active: false },
  { name: "Clients", icon: "👥", active: false },
  { name: "Profile", icon: "👤", active: false },
]

export default function Sidebar() {
  return (
    <div className="w-48 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo/Brand */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-sidebar-foreground">hCraft Solutions</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.name}
            variant={item.active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start mb-1 text-sidebar-foreground",
              item.active && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Button>
        ))}
      </nav>

      {/* Issue indicator */}
      <div className="p-2">
        <Badge variant="destructive" className="w-full justify-center">
          1 Issue ✕
        </Badge>
      </div>
    </div>
  )
}
