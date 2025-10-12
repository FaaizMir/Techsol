"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

interface AdminRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, redirectTo = "/dashboard" }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, user?.role, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="animate-pulse text-xl md:text-2xl text-white">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="text-xl md:text-2xl text-white">
          Access Denied
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;