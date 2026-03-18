export type Lang = "en" | "zh" | "es" | "fr" | "ja" | "ko" | "vi";

const supported: Lang[] = ["en", "zh", "es", "fr", "ja", "ko", "vi"];
export function pickLang(v?: string): Lang {
  const raw = (v || "en").toLowerCase();

  if (raw === "cn" || raw === "zh-cn" || raw === "zh_hans" || raw.startsWith("zh")) return "zh";
  if (raw.startsWith("es")) return "es";
  if (raw.startsWith("fr")) return "fr";
  if (raw.startsWith("ja")) return "ja";
  if (raw.startsWith("ko")) return "ko";
  if (raw.startsWith("vi")) return "vi";

  return "en";
}
/**
 * Dynamic import: only loads the chosen language JSON.
 * Great for Next.js App Router (server components).
 */
export async function getDict(lang: Lang) {
  switch (lang) {
    case "zh":
      return (await import("../locales/zh.json")).default;
    case "es":
      return (await import("../locales/es.json")).default;
    case "fr":
      return (await import("../locales/fr.json")).default;
    case "ja":
      return (await import("../locales/ja.json")).default;
    case "ko":
      return (await import("../locales/ko.json")).default;
    case "vi":
      return (await import("../locales/vi.json")).default;
    case "en":
    default:
      return (await import("../locales/en.json")).default;
  }
}
