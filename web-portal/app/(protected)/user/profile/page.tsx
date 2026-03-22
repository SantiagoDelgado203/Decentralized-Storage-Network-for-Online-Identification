export default function UserProfilePage() {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">User Profile</h1>
            <p className="mt-2 text-slate-600">Review your account details and verification preferences.</p>
          </div>
          <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
            Edit (UI only)
          </button>
        </div>
  
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-200" />
              <div>
                <div className="font-semibold text-slate-900">Demo User</div>
                <div className="text-sm text-slate-600">demo.user@example.com</div>
              </div>
            </div>
  
            <div className="mt-5 space-y-2 text-sm text-slate-700">
              <div><span className="text-slate-500">Status:</span> Active</div>
              <div><span className="text-slate-500">Member since:</span> 2026</div>
              <div><span className="text-slate-500">Last request:</span> 2026-03-08</div>
            </div>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["Full Name", "Demo User"],
                ["Date of Birth", "YYYY-MM-DD"],
                ["Address", "123 Example St"],
                ["Country/Region", "US"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500">{k}</div>
                  <div className="mt-1 font-medium text-slate-900">{v}</div>
                </div>
              ))}
            </div>
  
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Note</div>
              <div className="mt-1">
                This page is UI-only for now. No logic or backend operations were modified.
              </div>
            </div>
          </div>
        </div>
  
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Verification Preferences</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Default response: approve/deny per request</li>
              <li>• Privacy: return policy-compliant results only</li>
              <li>• Notifications: email (UI placeholder)</li>
            </ul>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Security</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Password: ••••••••</li>
              <li>• 2FA: Not configured (UI placeholder)</li>
              <li>• Session: Active</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }