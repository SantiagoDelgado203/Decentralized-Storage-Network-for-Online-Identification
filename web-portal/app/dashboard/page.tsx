import { getDict, pickLang } from "@/lib/i18n";

export default async function UserDashboard(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await props.searchParams;
  const l = pickLang(lang);
  const t = await getDict(l);
  const d = t.dashboard ?? {};

  const pending = [
    { id: "REQ-1021", from: d.demoVerifierA ?? "Verifier A", request: d.demoReqOver18 ?? "Over 18?", time: d.demoTimeToday ?? "Today 10:24 AM" },
    { id: "REQ-1022", from: d.demoVerifierB ?? "Verifier B", request: d.demoReqFAU ?? "FAU Student?", time: d.demoTimeYesterday ?? "Yesterday 6:10 PM" },
  ];

  const history = [
    { id: "REQ-0991", request: d.demoReqOver21 ?? "Over 21?", result: d.approved ?? "Approved", time: d.demoTimeLastWeek ?? "Last week" },
    { id: "REQ-0977", request: d.demoReqAddress ?? "Address verified?", result: d.denied ?? "Denied", time: d.demoTime2Weeks ?? "2 weeks ago" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">{d.title ?? "Dashboard"}</h1>
      <p className="mt-2 text-slate-600">
        {d.subtitle ?? "Review your verification requests and account status."}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{d.profileTitle ?? "Profile"}</h2>
          <div className="mt-3 space-y-1 text-sm text-slate-700">
            <div>
              <span className="text-slate-500">{d.userLabel ?? "User:"}</span> {d.demoUser ?? "Demo User"}
            </div>
            <div>
              <span className="text-slate-500">{d.statusLabel ?? "Status:"}</span> {d.active ?? "Active"}
            </div>
            <div>
              <span className="text-slate-500">{d.lastVerificationLabel ?? "Last Verification:"}</span>{" "}
              {d.demoLastVerification ?? "2026-02-10"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">{d.pendingTitle ?? "Pending Requests"}</h2>
          <div className="mt-4 space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <div className="font-medium text-slate-900">{p.request}</div>
                  <div className="text-sm text-slate-600">
                    {p.from} • {p.time} • {p.id}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
                    {d.deny ?? "Deny"}
                  </button>
                  <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
                    {d.accept ?? "Accept"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {d.uiOnlyNote ?? "*Buttons are UI-only for the demo (no functionality yet)."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-3">
          <h2 className="text-lg font-semibold text-slate-900">{d.historyTitle ?? "History"}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {history.map((h) => (
              <div key={h.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-900">{h.request}</div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    {h.result}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {h.time} • {h.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}