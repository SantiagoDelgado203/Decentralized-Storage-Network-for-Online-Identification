"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { login } from "../../../Connectors";
import Link from "next/link";

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
    <>
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

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* User */}
          <Link
            href="/login/user"
            className="group rounded-3xl bg-background p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Login as User
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  For individuals accessing the portal to request services and
                  manage verification history.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                USER
              </span>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                View dashboard & requests
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                Track verification results
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                Manage identity profile
              </li>
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700">
              Continue
              <span className="transition group-hover:translate-x-0.5">→</span>
            </div>
          </Link>

          {/* Provider */}
          <Link
            href="/login/verifier" // 如果你实际是 /login/verifier，就改这里
            className="group rounded-3xl bg-background p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Login as Service Provider
                  </h2>
                  
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  For organizations responding to verification requests and
                  managing service operations.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                PROVIDER
              </span>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                Review incoming requests
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                Manage provider account
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                Process & respond securely
              </li>
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
              Continue
              <span className="transition group-hover:translate-x-0.5">→</span>
            </div>
          </Link>
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
        {/* Footer helper */}
      </div>
      <div className="mt-8 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-green-700 hover:underline"
        >
          Register
        </Link>
      </div>
      </>
  );
}