"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../loading"
import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";
import { logout } from "@/Connectors";


export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  var context = useContext(AuthContext);
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

  const handleLogout = async () => {
    try {
      const res = await logout()
      alert(res.reply)
      context = null; // clear user in context
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-black shadow-lg shadow-green-950">
        <div className="flex items-center justify-between p-6 md:p-5">

          <Link href="/">
            {/* Logo SVG */}
            <svg className="inline fill-none size-14 stroke-green-500 stroke-1" viewBox="0 0 32 32">
              <path d="M26.5,20c-0.8..." />
            </svg>
            <p className="inline mx-5 text-2xl font-mono align-middle">
              Decentralized Storage Network
            </p>
          </Link>

          <nav className="hidden md:flex gap-10 mr-10 items-center">
            <Link href="/user/dashboard" className="hover:text-green-400 transition">
              Dashboard
            </Link>
            <Link href="/user/history" className="hover:text-green-400 transition">
              History
            </Link>
            <Link href="/user/upload" className="hover:text-green-400 transition">
              Upload
            </Link>


            {/* ✅ Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-6 px-4 hover:text-red-700 rounded transition hover:cursor-pointer"
            >
              Logout
            </button>
          </nav>

        </div>
      </header>

      <main className="m-5 md:m-10 lg:m-20">
        {children}
      </main>

      <footer className="dark:bg-[#0a0a0a]">
      </footer>
    </>
  );
}