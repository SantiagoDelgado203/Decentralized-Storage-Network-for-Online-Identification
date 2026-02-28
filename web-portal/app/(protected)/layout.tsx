"use client"
import Link from "next/link";
import "../globals.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { logout } from "@/Connectors";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  var context = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!context?.loading && !context?.user) {
      alert("Log in first.");
      router.push("/login");
    }
  }, [context?.loading, context?.user, router]);

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

  if (context?.loading) return <p>Loading...</p>;
  if (!context?.user) return null;

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
            <Link href="/user/history" className="hover:text-green-400 transition">
              History
            </Link>
            <Link href="/help" className="hover:text-green-400 transition">
              Help
            </Link>
            <Link href="/user/profile" className="hover:text-green-400 transition">
              Profile
            </Link>

            {/* ✅ Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
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
        Lorem ipsum
      </footer>
    </>
  );
}