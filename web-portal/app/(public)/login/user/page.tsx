"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getDict, pickLang, type Lang } from "@/lib/i18n";
import { login } from "../../../../Connectors"; // keep your path

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // 1) read lang from URL
  const lang = useMemo<Lang>(() => pickLang(sp.get("lang") ?? undefined), [sp]);
  const q = `?lang=${lang}`;

  // 2) load dictionary (client-side)
  const [t, setT] = useState<any>(null);

  useEffect(() => {
    let alive = true;
    getDict(lang).then((d) => {
      if (alive) setT(d);
    });
    return () => {
      alive = false;
    };
  }, [lang]);

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await login({ email, password });
    setResponse(res.reply);

    // if you want redirect after success, do it here based on res
    // router.push(`/dashboard${q}`);
  }

  // fallback while dict is loading
  const auth = t?.auth ?? {};
  const title = auth.loginTitle ?? "Login";
  const subtitle = auth.loginSubtitle ?? "Welcome back to DIDN Portal.";
  const emailLabel = auth.email ?? "Email";
  const passwordLabel = auth.password ?? "Password";
  const btn = auth.signIn ?? "Log In";
  const noAccount = auth.noAccount ?? "No account?";
  const createOne = auth.createOne ?? "Create one";

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            {emailLabel}
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            {passwordLabel}
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800"
        >
          {btn}
        </button>

        <div className="text-sm text-slate-600">
          {noAccount}{" "}
          <Link className="text-green-600 hover:underline" href={`/register${q}`}>
            {createOne}
          </Link>
        </div>

        {response && (
          <pre className="mt-2 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {response}
          </pre>
        )}
      </form>
    </div>
  );
}
