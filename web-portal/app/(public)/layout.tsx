"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "../globals.css";

const copy = {
  en: { brand: "DIDN Portal", about: "About Us", login: "Login", register: "Register", lang: "Language" },
  zh: { brand: "DIDN 门户", about: "关于我们", login: "登录", register: "注册", lang: "语言" },
  es: { brand: "Portal DIDN", about: "Sobre nosotros", login: "Iniciar sesión", register: "Registrarse", lang: "Idioma" },
  fr: { brand: "Portail DIDN", about: "À propos", login: "Connexion", register: "S’inscrire", lang: "Langue" },
  ja: { brand: "DIDN ポータル", about: "私たちについて", login: "ログイン", register: "登録", lang: "言語" },
  ko: { brand: "DIDN 포털", about: "소개", login: "로그인", register: "회원가입", lang: "언어" },
  vi: { brand: "Cổng DIDN", about: "Giới thiệu", login: "Đăng nhập", register: "Đăng ký", lang: "Ngôn ngữ" },
} as const;

type Lang = keyof typeof copy;

const langLabel: Record<Lang, string> = {
  en: "English",
  zh: "中文",
  es: "Español",
  fr: "Français",
  ja: "日本語",
  ko: "한국어",
  vi: "Tiếng Việt",
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

  // 带上 lang，避免切页后语言丢失
  const withLang = (href: string) => {
    const nextParams = new URLSearchParams(sp.toString());
    nextParams.set("lang", lang);
    return `${href}?${nextParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href={withLang("/")} className="text-lg font-semibold tracking-tight">
            {t.brand}
          </Link>

          <div className="flex items-center gap-4">
            {/* Language Switch */}
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <span className="hidden sm:inline">{t.lang}</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="rounded-md border px-2 py-1 text-sm"
              >
                {(Object.keys(copy) as Lang[]).map((k) => (
                  <option key={k} value={k}>
                    {langLabel[k]}
                  </option>
                ))}
              </select>
            </label>

            <nav className="flex items-center gap-5 text-sm">
              <Link href={withLang("/about")} className="hover:underline">
                {t.about}
              </Link>
              <Link href={withLang("/login")} className="hover:underline">
                {t.login}
              </Link>
              <Link
                href={withLang("/register")}
                className="rounded-md border px-3 py-1.5 hover:bg-gray-50"
              >
                {t.register}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-xs text-gray-500">
        © 2026 DIDN • Decentralized Verification Network
      </footer>
    </div>
  );
}

