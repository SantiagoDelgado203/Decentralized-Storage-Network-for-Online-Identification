import { getDict, pickLang } from "@/lib/i18n";

export default async function VerifierProfilePage(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await props.searchParams;
  const l = pickLang(lang);
  const t = await getDict(l);

  const v = t?.verifierProfile;

  // ✅ 原英文内容（完全保留，用作 fallback）
  const fallback = {
    title: "Verifier Profile",
    subtitle: "Organization details and request handling settings (UI-only).",
    edit: "Edit (UI only)",
    demoOrg: "Demo Verifier Org",
    demoEmail: "verifier@example.com",
    roleLabel: "Role:",
    roleValue: "Service Provider",
    statusLabel: "Status:",
    statusValue: "Active",
    queueLabel: "Queue:",
    queueValue: "2 pending",
    orgTitle: "Organization Information",
    orgFields: [
      ["Organization Name", "Demo Verifier Org"],
      ["Service Type", "Identity Verification"],
      ["Region", "US"],
      ["Contact", "verifier@example.com"],
    ] as Array<[string, string]>,
    noteTitle: "Reminder",
    noteBody:
      "UI changes only: layout/typography improvements. No backend logic was modified.",
    rhTitle: "Request Handling",
    rhItems: [
      "Default SLA: 24 hours (placeholder)",
      "Auto-approve: Disabled",
      "Audit logging: Enabled (UI)",
    ],
    ssTitle: "Service Settings",
    ssItems: [
      "Supported checks: Age, Student Status (UI)",
      "Response format: Yes/No",
      "Privacy policy: Minimal disclosure",
    ],
  };

  const title = v?.title ?? fallback.title;
  const subtitle = v?.subtitle ?? fallback.subtitle;
  const edit = v?.edit ?? fallback.edit;

  const demoOrg = v?.demoOrg ?? fallback.demoOrg;
  const demoEmail = v?.demoEmail ?? fallback.demoEmail;

  const roleLabel = v?.roleLabel ?? fallback.roleLabel;
  const roleValue = v?.roleValue ?? fallback.roleValue;
  const statusLabel = v?.statusLabel ?? fallback.statusLabel;
  const statusValue = v?.statusValue ?? fallback.statusValue;
  const queueLabel = v?.queueLabel ?? fallback.queueLabel;
  const queueValue = v?.queueValue ?? fallback.queueValue;

  const orgTitle = v?.orgTitle ?? fallback.orgTitle;

  const orgFields: Array<[string, string]> =
    v?.orgFields?.map((x: any) => [x.k, x.v]) ?? fallback.orgFields;

  const noteTitle = v?.noteTitle ?? fallback.noteTitle;
  const noteBody = v?.noteBody ?? fallback.noteBody;

  // 下面两块暂时直接回退英文（你脚本里没配也没关系）
  const rhTitle = fallback.rhTitle;
  const rhItems = fallback.rhItems;
  const ssTitle = fallback.ssTitle;
  const ssItems = fallback.ssItems;

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
            <div className="h-12 w-12 rounded-xl bg-slate-200" />
            <div>
              <div className="font-semibold text-slate-900">{demoOrg}</div>
              <div className="text-sm text-slate-600">{demoEmail}</div>
            </div>
          </div>

          <div className="mt-5 space-y-2 text-sm text-slate-700">
            <div>
              <span className="text-slate-500">{roleLabel}</span> {roleValue}
            </div>
            <div>
              <span className="text-slate-500">{statusLabel}</span> {statusValue}
            </div>
            <div>
              <span className="text-slate-500">{queueLabel}</span> {queueValue}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">{orgTitle}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {orgFields.map(([k, val]) => (
              <div key={k} className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">{k}</div>
                <div className="mt-1 font-medium text-slate-900">{val}</div>
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
          <h2 className="text-lg font-semibold text-slate-900">{rhTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {rhItems.map((x) => (
              <li key={x}>• {x}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{ssTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {ssItems.map((x) => (
              <li key={x}>• {x}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}