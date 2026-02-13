export default function DashboardPage() {
  const stats = [
    { label: "Active Nodes", value: "5", sub: "+1 this week" },
    { label: "Shards Stored", value: "1,284", sub: "last 24h: 96" },
    { label: "Retrievals", value: "312", sub: "success: 98.7%" },
    { label: "Avg Latency", value: "142ms", sub: "p95: 320ms" },
  ];

  const recentActivity = [
    { title: "Shard batch uploaded", time: "2 min ago",detail: "CID: bafy...91a2 • 12 shards" },
    { title: "Node joined network", time: "18 min ago", detail: "peer: 12D3KooW...X3f" },
    { title: "Reconstruction request", time: "1 hr ago", detail: "k=3 of n=5 • verified" },
    { title: "Health check passed", time: "3 hr ago", detail: "all nodes reachable" },
  ];

  const nodes = [
    { name: "storage-node-1", status: "Healthy", region: "US-East", uptime: "2d 11h" },
    { name: "storage-node-2", status: "Healthy", region: "US-East", uptime: "1d 04h" },
    { name: "storage-node-3", status: "Degraded", region: "US-East", uptime: "9h 18m" },
    { name: "storage-node-4", status: "Healthy", region: "US-East", uptime: "3d 02h" },
    { name: "storage-node-5", status: "Healthy", region: "US-East", uptime: "7h 55m" },
  ];

  const badgeClass = (status: string) => {
    if (status === "Healthy") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "Degraded") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Network Overview</h1>
            <p className="mt-1 text-slate-600">Decentralized identity storage • encrypted shards • DHT discovery</p>
          </div>

          <div className="mt-4 flex gap-3 md:mt-0">
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              Export Report
            </button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800">
              New Upload
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
              <h2 className="text-base font-semibold text-slate-900">Storage Trend</h2>
              <div className="text-xs text-slate-500">Last 7 days</div>
            </div>

            <div className="mt-5 h-56 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-white text-sm text-slate-500">
                Chart Placeholder (UI only)
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Replication</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">n=5</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Threshold</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">k=3</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Encryption</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">AES-GCM</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Recent 
Activity</h2>
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
            <h2 className="text-base font-semibold text-slate-900">Nodes</h2>
            <div className="flex gap-2">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">Search (UI)</div>
              <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
                Add Node
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Region</th>
                  <th className="py-3 pr-4">Uptime</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((n) => (
                  <tr key={n.name} className="border-b border-slate-100">
                    <td className="py-4 pr-4 font-medium text-slate-900">{n.name}</td>
                    <td className="py-4 pr-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(n.status)}`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{n.region}</td>
                    <td className="py-4 pr-4 text-slate-600">{n.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-slate-500">* Demo content only 
— no live data connected.</div>
        </div>
      </div>
    </div>
  );
}


