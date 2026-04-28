"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "../globals.css";

const copy = {
  en: { brand: "DIDN", about: "About", login: "Login", register: "Register", lang: "Language" },
  zh: { brand: "DIDN", about: "关于我们", login: "登录", register: "注册", lang: "语言" },
  es: { brand: "DIDN", about: "Sobre nosotros", login: "Iniciar sesión", register: "Registrarse", lang: "Idioma" },
  fr: { brand: "DIDN", about: "À propos", login: "Connexion", register: "S'inscrire", lang: "Langue" },
  ja: { brand: "DIDN", about: "私たちについて", login: "ログイン", register: "登録", lang: "言語" },
  ko: { brand: "DIDN", about: "소개", login: "로그인", register: "회원가입", lang: "언어" },
  vi: { brand: "DIDN", about: "Giới thiệu", login: "Đăng nhập", register: "Đăng ký", lang: "Ngôn ngữ" },
} as const;

type Lang = keyof typeof copy;

const langLabel: Record<Lang, string> = {
  en: "EN",
  zh: "中文",
  es: "ES",
  fr: "FR",
  ja: "日本語",
  ko: "한국어",
  vi: "VI",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const lang = ((sp.get("lang") as Lang) || "en") as Lang;
  const t = copy[lang] ?? copy.en;

  function setLang(next: Lang) {
    const nextParams = new URLSearchParams(sp.toString());
    nextParams.set("lang", next);
    router.push(`${pathname}?${nextParams.toString()}`);
  }

  const withLang = (href: string) => {
    const nextParams = new URLSearchParams(sp.toString());
    nextParams.set("lang", lang);
    return `${href}?${nextParams.toString()}`;
  };

  const navLink = (href: string, label: string) => {
    const isActive = pathname === href;
    return (
      <Link
        href={withLang(href)}
        className={`
          font-mono text-[11px] tracking-widest uppercase px-3 py-1.5 border transition-all duration-150
          ${isActive
            ? "border-green-500/25 text-green-400 bg-green-500/6"
            : "border-transparent text-green-900 dark:text-green-800 hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/4"
          }
        `}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#090d0a] text-[#c8d8c0] relative overflow-x-hidden">

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,200,80,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,80,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1e3320] bg-[rgba(9,13,10,0.92)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-14">

          {/* Brand */}
          <Link href={withLang("/")} className="flex items-center gap-2 group">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_#4ade80]" />
            <span className="font-mono text-sm font-bold tracking-[0.12em] uppercase text-green-400">
              {t.brand}
            </span>
            <span className="inline-block w-[7px] h-[13px] bg-green-400 ml-0.5 animate-[blink_1.1s_step-end_infinite]" />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <nav className="flex items-center">
              {navLink("/", "Home")}
              {navLink("https://github.com/SantiagoDelgado203/Decentralized-Storage-Network-for-Online-Identification", "Docs")}
              {navLink("/about", t.about)}
              {navLink("/login", t.login)}
              {navLink("/news", "News")}
            </nav>

            {/* Language selector */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="
                font-mono text-[11px] tracking-wide bg-white/4 border border-[#1e3320]
                text-[#7a9e7a] px-2 py-1.5 appearance-none cursor-pointer
                focus:outline-none focus:border-green-500/50 ml-2
              "
            >
              {(Object.keys(copy) as Lang[]).map((k) => (
                <option key={k} value={k}>{langLabel[k]}</option>
              ))}
            </select>

            {/* Register CTA */}
            <Link
              href={withLang("/register")}
              className="
                font-mono text-[11px] font-medium tracking-[0.1em] uppercase
                px-4 py-2 border border-green-400 text-green-400
                hover:bg-green-400 hover:text-[#090d0a] transition-all duration-150 ml-1
              "
            >
              {t.register}
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        {children}
      </main>

      {/* Footer status bar */}
      <footer className="relative z-10 border-t border-[#1e3320] bg-[rgba(9,13,10,0.95)]">
        <div className="mx-auto max-w-6xl px-6 py-2 flex items-center justify-between">
          <p className="font-mono text-[10px] text-[#2a4a2a] tracking-wider">
            {/* © 2026 DIDN • Decentralized Verification Network */}
          </p>
        </div>
      </footer>

      {/* Blink animation (add to globals.css if not present) */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}