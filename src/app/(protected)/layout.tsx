import ProtectedRoute from "@/components/common/ProtectedRoute"
import OnboardingChecker from "@/components/common/OnboardingChecker"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <OnboardingChecker />
      {children}
    </ProtectedRoute>
  )
}