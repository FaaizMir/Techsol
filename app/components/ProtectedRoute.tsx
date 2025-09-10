"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface DecodedToken {
  exp: number;
}

// ✅ helper to check expiry
function isTokenExpired(token: string) {
  try {
    const { exp } = jwtDecode<DecodedToken>(token); // ✅ proper typing
    return Date.now() >= exp * 1000;
  } catch {
    return true; // if decoding fails, treat as expired
  }
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🚀 if no token, redirect right away
    if (!token) {
      router.replace("/login");
      return;
    }

    // 🚀 check expiry first before calling backend
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      router.replace("/login");
      return;
    }

    // ✅ token exists & is valid -> verify with backend
    axios
      .get("https://techsol-backend.vercel.app/api/protected/check-auth", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.replace("/login");
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Checking authentication...
      </div>
    );
  }

  // 🚀 Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
