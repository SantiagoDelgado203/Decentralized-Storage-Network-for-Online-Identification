
import { getDict, pickLang } from "@/lib/i18n";

export default async function AboutPage(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await props.searchParams;
  const l = pickLang(lang);
  const t = await getDict(l);

  return (
    <div className="space-y-8 bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Hero */}
      <section
        className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8
                   shadow-sm dark:border-slate-800 dark:from-slate-900/40 dark:to-slate-950"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t.about.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
          {t.about.body}
        </p>
      </section>

      {/* Why */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t.about.whyTitle}
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {(t.about.bullets ?? []).map((b: string) => (
            <li key={b} className="flex gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}