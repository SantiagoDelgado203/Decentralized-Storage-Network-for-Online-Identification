import { getDict, pickLang } from "@/lib/i18n";

export default async function DashboardPage(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await props.searchParams;
  const l = pickLang(lang);
  const t = await getDict(l);

  const n = t.networkDashboard ?? {};

  const stats = [
    { label: n.statsActiveNodes ?? "Active Nodes", value: "5", sub: n.statsActiveNodesSub ?? "+1 this week" },
    { label: n.statsShardsStored ?? "Shards Stored", value: "1,284", sub: n.statsShardsStoredSub ?? "last 24h: 96" },
    { label: n.statsRetrievals ?? "Retrievals", value: "312", sub: n.statsRetrievalsSub ?? "success: 98.7%" },
    { label: n.statsAvgLatency ?? "Avg Latency", value: "142ms", sub: n.statsAvgLatencySub ?? "p95: 320ms" },
  ];

  const recentActivity = [
    { title: n.actUploadTitle ?? "Shard batch uploaded", time: n.actUploadTime ?? "2 min ago", detail: n.actUploadDetail ?? "CID: bafy...91a2 • 12 shards" },
    { title: n.actNodeJoinTitle ?? "Node joined network", time: n.actNodeJoinTime ?? "18 min ago", detail: n.actNodeJoinDetail ?? "peer: 12D3KooW...X3f" },
    { title: n.actReconstructTitle ?? "Reconstruction event (demo)", time: n.actReconstructTime ?? "1 hr ago", detail: n.actReconstructDetail ?? "k=3 of n=5 • UI-only" },
    { title: n.actHealthTitle ?? "Health check passed", time: n.actHealthTime ?? "3 hr ago", detail: n.actHealthDetail ?? "all nodes reachable" },
  ];

  const nodes = [
    { name: "storage-node-1", status: n.statusHealthy ?? "Healthy", region: "US-East", uptime: "2d 11h" },
    { name: "storage-node-2", status: n.statusHealthy ?? "Healthy", region: "US-East", uptime: "1d 04h" },
    { name: "storage-node-3", status: n.statusDegraded ?? "Degraded", region: "US-East", uptime: "9h 18m" },
    { name: "storage-node-4", status: n.statusHealthy ?? "Healthy", region: "US-East", uptime: "3d 02h" },
    { name: "storage-node-5", status: n.statusHealthy ?? "Healthy", region: "US-East", uptime: "7h 55m" },
  ];

  const badgeClass = (status: string) => {
    if (status === (n.statusHealthy ?? "Healthy")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === (n.statusDegraded ?? "Degraded")) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {n.title ?? "Network Overview"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {n.subtitle ?? "Network overview (read-only). Metrics shown are UI placeholders for the demo."}
            </p>
            <p className="mt-1 text-slate-600">
              {n.tagline ?? "Decentralized identity storage • encrypted shards • DHT discovery"}
            </p>
          </div>

          <div className="mt-4 flex gap-3 md:mt-0">
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              {n.exportReport ?? "Export Report"}
            </button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800">
              {n.newUpload ?? "New Upload"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-600">{s.label}</div>
              <div className="mt-2 text-3xl font-semibold text-slate-900">{s.value}</div>
              <div className="mt-2 text-xs text-slate-500">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">{n.storageTrend ?? "Storage Trend"}</h2>
              <div className="text-xs text-slate-500">{n.last7Days ?? "Last 7 days"}</div>
            </div>

            <div className="mt-5 h-56 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-white text-sm text-slate-500">
                {n.chartPlaceholder ?? "Chart Placeholder (UI only)"}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">{n.replication ?? "Replication"}</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">n=5</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">{n.threshold ?? "Threshold"}</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">k=3</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">{n.encryption ?? "Encryption"}</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">AES-GCM</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">{n.recentActivity ?? "Recent Activity"}</h2>
            <div className="mt-4 space-y-4">
              {recentActivity.map((a) => (
                <div key={a.title} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-slate-900">{a.title}</div>
                    <div className="text-xs text-slate-500">{a.time}</div>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">{a.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-slate-900">{n.nodesTitle ?? "Nodes"}</h2>
            <div className="flex gap-2">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                {n.searchUi ?? "Search (UI)"}
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4">{n.thName ?? "Name"}</th>
                  <th className="py-3 pr-4">{n.thStatus ?? "Status"}</th>
                  <th className="py-3 pr-4">{n.thRegion ?? "Region"}</th>
                  <th className="py-3 pr-4">{n.thUptime ?? "Uptime"}</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((row) => (
                  <tr key={row.name} className="border-b border-slate-100">
                    <td className="py-4 pr-4 font-medium text-slate-900">{row.name}</td>
                    <td className="py-4 pr-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{row.region}</td>
                    <td className="py-4 pr-4 text-slate-600">{row.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            {n.demoOnly ?? "* Demo content only — no live data connected."}
          </div>
        </div>
      </div>
    </div>
  );
}


