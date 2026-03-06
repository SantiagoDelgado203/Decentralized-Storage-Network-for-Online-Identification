"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("http://localhost:5000/api/auth/user", {
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/login");
          return;
        }

        setLoading(false);
      } catch (error) {
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}