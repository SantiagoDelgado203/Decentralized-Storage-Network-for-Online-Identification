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
          {(t.about.bullets ?? []).map((b: string, idx: number) => (
            <li key={idx} className="flex gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gray-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Our Vision */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{t.about.ourVisionTitle}</h2>
        <p className="text-sm text-gray-700">{t.about.ourVisionBody}</p>
      </section>

      {/* Our Values */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{t.about.ourValuesTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          {(t.about.values ?? []).map((value: string, idx: number) => (
            <li key={idx} className="flex gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gray-400" />
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Meet the Team */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{t.about.meetTheTeamTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          {(t.about.teamMembers ?? []).map((member: { name: string, role: string }, idx: number) => (
            <li key={idx} className="flex gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gray-400" />
              <span>
                <strong>{member.name}</strong> - {member.role}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact Us */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{t.about.contactTitle}</h2>
        <p className="text-sm text-gray-700">{t.about.contactBody}</p>
      </section>
    </div>
  );
}