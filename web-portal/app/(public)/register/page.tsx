import Link from "next/link";

export default function RegisterSelectionPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-3 text-slate-600">
            Choose the account type that matches how you’ll use the DIDN Portal.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* User */}
          <Link
            href="/register/user"
            className="group rounded-3xl bg-background p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Register as User
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  For individuals who want to request services, manage identity,
                  and submit verification requests.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                USER
              </span>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                Access the dashboard and request services
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                Track verification status & history
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                Secure identity storage workflow
              </li>
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700">
              Continue
              <span className="transition group-hover:translate-x-0.5">→</span>
            </div>
          </Link>

          {/* Provider */}
          <Link
            href="/register/verifier"
            className="group rounded-3xl bg-background p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Register as Service Provider
                  </h2>
      
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  For organizations who provide services, respond to user
                  requests, and perform verification.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                PROVIDER
              </span>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                Receive and process verification requests
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                Manage provider profile & service info
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                View request queue & responses
              </li>
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
              Continue
              <span className="transition group-hover:translate-x-0.5">→</span>
            </div>
          </Link>
        </div>

        {/* Footer helper */}
        <div className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-green-700 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}