export default function VerifierProfilePage() {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Verifier Profile</h1>
            <p className="mt-2 text-slate-600">Organization details and request handling settings (UI-only).</p>
          </div>
          <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
            Edit (UI only)
          </button>
        </div>
  
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-200" />
              <div>
                <div className="font-semibold text-slate-900">Demo Verifier Org</div>
                <div className="text-sm text-slate-600">verifier@example.com</div>
              </div>
            </div>
  
            <div className="mt-5 space-y-2 text-sm text-slate-700">
              <div><span className="text-slate-500">Role:</span> Service Provider</div>
              <div><span className="text-slate-500">Status:</span> Active</div>
              <div><span className="text-slate-500">Queue:</span> 2 pending</div>
            </div>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">Organization Information</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["Organization Name", "Demo Verifier Org"],
                ["Service Type", "Identity Verification"],
                ["Region", "US"],
                ["Contact", "verifier@example.com"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500">{k}</div>
                  <div className="mt-1 font-medium text-slate-900">{v}</div>
                </div>
              ))}
            </div>
  
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Reminder</div>
              <div className="mt-1">
                UI changes only: layout/typography improvements. No backend logic was modified.
              </div>
            </div>
          </div>
        </div>
  
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Request Handling</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Default SLA: 24 hours (placeholder)</li>
              <li>• Auto-approve: Disabled</li>
              <li>• Audit logging: Enabled (UI)</li>
            </ul>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Service Settings</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Supported checks: Age, Student Status (UI)</li>
              <li>• Response format: Yes/No</li>
              <li>• Privacy policy: Minimal disclosure</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }