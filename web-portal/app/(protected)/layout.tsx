import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "DIDN Web Portal",
  description: "Protected pages",
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}

