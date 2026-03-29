import { getDict, pickLang } from "@/lib/i18n";

export default async function UserProfilePage(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await props.searchParams;
  const l = pickLang(lang);
  const t = await getDict(l);

  const p = t?.userProfile;

  // ✅ 原英文内容（完全不改，只当 fallback）
  const fallback = {
    title: "User Profile",
    subtitle: "Review your account details and verification preferences.",
    edit: "Edit (UI only)",
    demoName: "Demo User",
    demoEmail: "demo.user@example.com",
    statusLabel: "Status:",
    statusValue: "Active",
    memberSinceLabel: "Member since:",
    memberSinceValue: "2026",
    lastRequestLabel: "Last request:",
    lastRequestValue: "2026-03-08",
    personalTitle: "Personal Information",
    fields: [
      ["Full Name", "Demo User"],
      ["Date of Birth", "YYYY-MM-DD"],
      ["Address", "123 Example St"],
      ["Country/Region", "US"],
    ] as Array<[string, string]>,
    noteTitle: "Note",
    noteBody:
      "This page is UI-only for now. No logic or backend operations were modified.",
    prefTitle: "Verification Preferences",
    prefItems: [
      "Default response: approve/deny per request",
      "Privacy: return policy-compliant results only",
      "Notifications: email (UI placeholder)",
    ],
    secTitle: "Security",
    secItems: [
      "Password: ••••••••",
      "2FA: Not configured (UI placeholder)",
      "Session: Active",
    ],
  };

  // ✅ 用翻译覆盖（如果存在），否则用 fallback
  const title = p?.title ?? fallback.title;
  const subtitle = p?.subtitle ?? fallback.subtitle;
  const edit = p?.edit ?? fallback.edit;
  const demoName = p?.demoName ?? fallback.demoName;
  const demoEmail = p?.demoEmail ?? fallback.demoEmail;

  const statusLabel = p?.statusLabel ?? fallback.statusLabel;
  const statusValue = p?.statusValue ?? fallback.statusValue;
  const memberSinceLabel = p?.memberSinceLabel ?? fallback.memberSinceLabel;
  const memberSinceValue = p?.memberSinceValue ?? fallback.memberSinceValue;
  const lastRequestLabel = p?.lastRequestLabel ?? fallback.lastRequestLabel;
  const lastRequestValue = p?.lastRequestValue ?? fallback.lastRequestValue;

  const personalTitle = p?.personalTitle ?? fallback.personalTitle;

  const fields: Array<[string, string]> =
    p?.personalFields?.map((x: any) => [x.k, x.v]) ?? fallback.fields;

  const noteTitle = p?.noteTitle ?? fallback.noteTitle;
  const noteBody = p?.noteBody ?? fallback.noteBody;

  // 下面两块你 JSON 里暂时没配也没关系：直接回退英文
  const prefTitle = fallback.prefTitle;
  const prefItems = fallback.prefItems;
  const secTitle = fallback.secTitle;
  const secItems = fallback.secItems;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-2 text-slate-600">{subtitle}</p>
        </div>
        <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
          {edit}
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-slate-200" />
            <div>
              <div className="font-semibold text-slate-900">{demoName}</div>
              <div className="text-sm text-slate-600">{demoEmail}</div>
            </div>
          </div>

          <div className="mt-5 space-y-2 text-sm text-slate-700">
            <div>
              <span className="text-slate-500">{statusLabel}</span> {statusValue}
            </div>
            <div>
              <span className="text-slate-500">{memberSinceLabel}</span> {memberSinceValue}
            </div>
            <div>
              <span className="text-slate-500">{lastRequestLabel}</span> {lastRequestValue}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">{personalTitle}</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {fields.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">{k}</div>
                <div className="mt-1 font-medium text-slate-900">{v}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-medium text-slate-900">{noteTitle}</div>
            <div className="mt-1">{noteBody}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{prefTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {prefItems.map((x) => (
              <li key={x}>• {x}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{secTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {secItems.map((x) => (
              <li key={x}>• {x}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}