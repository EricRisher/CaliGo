"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ReactNode } from "react";

export default function ProtectedPage({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          router.push("/login"); // Redirect if not authenticated
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/login"); // Redirect on error
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) return null; // Optionally show a loading indicator

  return <>{children}</>; // Render child components if authenticated
}
