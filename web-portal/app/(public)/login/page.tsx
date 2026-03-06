"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { login } from "../../../Connectors";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  // check if already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("http://localhost:5000/api/me", {
          credentials: "include",
        });

        if (!res.ok) return; // not logged in

        const data = await res.json();

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
  }, [router]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    try {
      const res = await login({ email, password });

      console.log("LOGIN RESPONSE:", res);
      setResponse(res?.reply ?? null);

      if (res?.status === 200) {
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
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-green-600 py-2 font-medium hover:bg-green-700 transition"
        >
          Log In
        </button>

        {response && (
          <pre className="mt-4 bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-emerald-400 text-sm overflow-auto">
            {response}
          </pre>
        )}
      </form>
    </div>
  );
}