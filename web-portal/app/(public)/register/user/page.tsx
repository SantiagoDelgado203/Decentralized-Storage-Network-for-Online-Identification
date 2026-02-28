"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { register } from "../../../../Connectors"; // keep your path
import { getDict, pickLang, type Lang } from "@/lib/i18n";

export default function RegisterPage() {
  const sp = useSearchParams();

  // 1) lang from URL
  const langParam = sp.get("lang") ?? undefined;
  const lang = useMemo<Lang>(() => pickLang(langParam), [langParam]);
  const q = `?lang=${lang}`;

  // 2) load dictionary
  const [t, setT] = useState<any>(null);
  useEffect(() => {
    let alive = true;
    getDict(lang).then((d) => alive && setT(d));
    return () => {
      alive = false;
    };
  }, [lang]);

  // form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await register({
      username,
      email,
      password,
    });

    setResponse(res.reply);
  }

  // text (fallback if auth missing)
  const auth = t?.auth ?? {};
  const title = auth.registerTitle ?? "Register";
  const subtitle = auth.registerSubtitle ?? "Create your DIDN Portal account.";
  const usernameLabel = auth.username ?? auth.name ?? "Username";
  const emailLabel = auth.email ?? "Email";
  const passwordLabel = auth.password ?? "Password";
  const btn = auth.createAccount ?? "Create Account";
  const haveAccount = auth.haveAccount ?? "Already have an account?";
  const goLogin = auth.goLogin ?? "Login";

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-semibold text-center text-slate-900">{title}</h1>
          <p className="mt-2 text-center text-sm text-slate-600">{subtitle}</p>
        </div>

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm font-medium text-slate-700">
            {usernameLabel}
          </label>
          <input
            id="username"
            type="text"
            placeholder="jasonmo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            {emailLabel}
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@example.com"
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800"
        >
          {btn}
        </button>

        <div className="text-center text-sm text-slate-600">
          {haveAccount}{" "}
          <Link className="text-green-600 hover:underline" href={`/login${q}`}>
            {goLogin}
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
