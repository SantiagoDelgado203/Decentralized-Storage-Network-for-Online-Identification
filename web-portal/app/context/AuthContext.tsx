"use client"

import { createContext, useEffect, useState, ReactNode } from "react";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  setUser: (user: any | null) => void; 
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/me", {
      credentials: "include",
    })
      .then(res => {
        console.log(res)
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setUser(data)
        console.log(data)
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}