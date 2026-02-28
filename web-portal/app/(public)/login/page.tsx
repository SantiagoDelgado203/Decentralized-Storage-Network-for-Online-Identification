"use client"
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "../../../Connectors"; // adjust import path


export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
    
  
      const res = await login({
        email,
        password,
      });
  
      setResponse(res.reply)
    }

  return (
    <div className="flex  items-center justify-center">
      <form className="w-full max-w-sm space-y-6 rounded-xl border border-gray-800 bg-black p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-center">
          Login
        </h1>

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
          type="button"
          className="w-full rounded-md bg-green-600 py-2 font-medium hover:bg-green-700 transition"
          onClick={handleSubmit}
        >
          Log In
        </button>
      <div>
            {response && (
              <pre className="mt-4 bg-neutral-950 border border-neutral-800 rounded-lg p-4
                              text-emerald-400 text-sm overflow-auto">
                {response}
              </pre>
            )}
          </div>
      </form>
    </div>
  );
}
