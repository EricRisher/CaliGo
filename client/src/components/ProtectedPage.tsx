"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

export default function ProtectedPage({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Track loading state
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            method: "GET",
            credentials: "include",
          }
        );

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

  if (isAuthenticated === null) {
    // Show a loading indicator while checking authentication
    return <div>Loading...</div>;
  }

  return <>{children}</>; // Render children if authenticated
}
