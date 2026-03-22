import Link from "next/link";
import { getDict, pickLang } from "@/lib/i18n";

export default async function LoginSelectionPage(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await props.searchParams;
  const l = pickLang(lang);
  const t = await getDict(l);
  const q = `?lang=${l}`;

  const s = t.loginSelection;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            {s.title}
          </h1>
          <p className="mt-3 text-slate-600">{s.subtitle}</p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* User */}
          <Link
            href={`/login/user${q}`}
            className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {s.userTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {s.userDesc}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {s.tagUser}
              </span>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                {s.userBullet1}
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                {s.userBullet2}
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-green-500" />
                {s.userBullet3}
              </li>
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700">
              {s.continue}
              <span className="transition group-hover:translate-x-0.5">→</span>
            </div>
          </Link>

          {/* Provider */}
          <Link
            href={`/login/verifier${q}`} // 如果你实际是 /login/verifier，就改这里
            className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {s.providerTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {s.providerDesc}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {s.tagProvider}
              </span>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                {s.providerBullet1}
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                {s.providerBullet2}
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-2 w-2 rounded-full bg-blue-500" />
                {s.providerBullet3}
              </li>
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
              {s.continue}
              <span className="transition group-hover:translate-x-0.5">→</span>
            </div>
          </Link>
        </div>

        {/* Footer helper */}
        <div className="mt-8 text-center text-sm text-slate-600">
          {s.footer}{" "}
          <Link
            href={`/register${q}`}
            className="font-semibold text-green-700 hover:underline"
          >
            {s.register}
          </Link>
        </div>
      </div>
    </div>
  );
}