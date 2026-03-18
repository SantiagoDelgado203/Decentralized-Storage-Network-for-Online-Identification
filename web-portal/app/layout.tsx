import { AuthProvider } from "./context/AuthContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


export const metadata = {
  title: "DIDN Web Portal",
  description: "Decentralized Storage Network for Online Identification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
      >
        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}
