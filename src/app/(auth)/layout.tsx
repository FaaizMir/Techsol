import { PublicRoute } from "@/components/common/PublicRoute"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PublicRoute>
      {children}
    </PublicRoute>
  )
}