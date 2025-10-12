import AdminRoute from "@/components/common/AdminRoute"
import AdminSidebar from "@/components/admin-dashboard/admin-sidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminRoute>
      <div className="flex h-screen bg-background dark">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </AdminRoute>
  )
}