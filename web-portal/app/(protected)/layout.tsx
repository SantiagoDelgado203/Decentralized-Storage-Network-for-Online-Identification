"use client"
import "../globals.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import "../globals.css";
import Loading from "../loading"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  var context = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!context?.user) {
      // alert("Log in first")
      router.push("/login");
    }
  }, []);

  if (context?.loading) return <Loading/>;
  if (!context?.user) return null;

  return children;
}