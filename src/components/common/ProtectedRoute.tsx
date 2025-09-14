"use client";

import { ReactNode } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="animate-pulse text-xl md:text-2xl text-white">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
