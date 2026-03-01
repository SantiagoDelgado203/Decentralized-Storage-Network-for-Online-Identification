/*import Link from "next/link";

export default function LoginSelectionPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-center">
          Login As
        </h1>

        <Link
          href="/login/user"
          className="rounded-md bg-green-600 py-2 px-6 text-center font-medium hover:bg-green-700 transition"
        >
          Login as User
        </Link>

        <Link
          href="/login/verifier"
          className="rounded-md bg-blue-600 py-2 px-6 text-center font-medium hover:bg-blue-700 transition"
        >
          Login as Service Provider
        </Link>
      </div>
    </div>
  );
}
*/
import Link from "next/link";

export default function LoginSelectionPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-50 to-white px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Sign in
          </h1>
          <p className="mt-3 text-slate-600">
            Choose the account type you want to log in with.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* User */}
          <Link
            href="/login/user"
            className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Login as User
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  For individuals accessing the portal to request services and
                  manage verification history.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                USER
              </span>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                View dashboard & requests
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                Track verification results
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                Manage identity profile
              </li>
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700">
              Continue
              <span className="transition group-hover:translate-x-0.5">→</span>
            </div>
          </Link>

          {/* Provider */}
          <Link
            href="/login/provider" // 如果你实际是 /login/verifier，就改这里
            className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Login as Service Provider
                  </h2>
                  
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  For organizations responding to verification requests and
                  managing service operations.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                PROVIDER
              </span>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                Review incoming requests
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                Manage provider account
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                Process & respond securely
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
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-green-700 hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}