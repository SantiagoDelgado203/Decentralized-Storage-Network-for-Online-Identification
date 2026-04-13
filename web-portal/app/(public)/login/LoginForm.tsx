"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { login } from "../../../Connectors";
import { AuthContext } from "@/app/context/AuthContext";

export default function LoginForm({ t }: { t: any }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const context = useContext(AuthContext);

  // check if already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("http://localhost:5000/api/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        context?.setUser(data);

        if (data.type === "user") {
          router.push("/user/dashboard");
        } else if (data.type === "verifier") {
          router.push("/verifier/dashboard");
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    }

    checkSession();
  }, [router, context]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await login({ email, password });

      setResponse(res?.reply ?? null);

      if (res?.ok) {
        const me = await fetch("http://localhost:5000/api/me", {
          credentials: "include",
        });

        if (!me.ok) {
          setResponse("Could not verify session.");
          return;
        }

        const data = await me.json();

        if (data.type === "user") {
          router.push("/user/dashboard");
        } else if (data.type === "verifier") {
          router.push("/verifier/dashboard");
        } else {
          setResponse("Unknown account type.");
        }
      }
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong.");
    }
  }

  return (
    <div className="flex items-center justify-center my-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-xl border border-gray-800 bg-black p-8 shadow-lg"
      >
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-white">
          {t.auth.loginTitle}
        </h1>

        <p className="text-center text-sm text-gray-400">
          {t.auth.loginSubtitle}
        </p>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-white">
            {t.auth.email}
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-gray-700 bg-transparent px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm text-white">
            {t.auth.password}
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-gray-700 bg-transparent px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-green-600 py-2 font-medium text-white hover:bg-green-700 transition"
        >
          {t.auth.signIn}
        </button>

        {/* Response */}
        {response && (
          <pre className="mt-4 bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-emerald-400 text-sm overflow-auto">
            {response}
          </pre>
        )}
      </form>
    </div>
  );
}