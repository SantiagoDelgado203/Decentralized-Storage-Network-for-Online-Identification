import { getDict, pickLang } from "@/lib/i18n";

export default async function AboutPage(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await props.searchParams;
  const l = pickLang(lang);
  const t = await getDict(l);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-2xl border bg-gradient-to-b from-white to-gray-50 p-8">
        <h1 className="text-3xl font-semibold tracking-tight">{t.about.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-700">{t.about.body}</p>
      </section>

      {/* Why */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{t.about.whyTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          {(t.about.bullets ?? []).map((b: string) => (
            <li key={b} className="flex gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gray-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
