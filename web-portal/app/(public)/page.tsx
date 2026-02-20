import Link from "next/link";
import { getDict, pickLang } from "@/lib/i18n";

export default async function Home(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await props.searchParams;
  const l = pickLang(lang);
  const t = await getDict(l);
  const q = `?lang=${l}`;

  return (
    <section className="flex flex-col gap-20">
      {/* Hero */}
      <div className="flex flex-col gap-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-mono font-semibold">
          {t.home.heroTitle}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t.home.heroDesc}
        </p>

        <div className="flex gap-4 mt-4">
          <Link
            href={`/docs${q}`}
            className="px-6 py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition font-mono"
          >
            {t.home.readDocs}
          </Link>

          <Link
            href={`/register${q}`}
            className="px-6 py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition font-mono"
          >
            {t.home.joinNetwork}
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300 dark:bg-gray-700" />

      {/* Overview */}
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-mono mb-4 text-green-500">
            {t.home.overviewTitle}
          </h2>

          <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
            {t.home.overviewBody1}
            <br />
            <br />
            {t.home.overviewBody2}
          </p>
        </div>

        <div className="border border-gray-300 dark:border-gray-700 p-6">
          <h3 className="font-mono mb-3 text-green-400">
            {t.home.guaranteesTitle}
          </h3>

          <ul className="space-y-2 text-gray-700 dark:text-gray-400 list-disc list-inside">
            {(t.home.guarantees ?? []).map((g: string) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trusted Authority */}
      <div className="max-w-5xl">
        <h2 className="text-2xl font-mono mb-4 text-green-500">
          {t.home.authorityTitle}
        </h2>

        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          {t.home.authorityBody1}
          <br />
          <br />
          {t.home.authorityBody2}
        </p>
      </div>

      {/* Storage & Encryption */}
      <div className="max-w-5xl">
        <h2 className="text-2xl font-mono mb-4 text-green-500">
          {t.home.storageTitle}
        </h2>

        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          {t.home.storageBody1}
          <br />
          <br />
          {t.home.storageBody2}
        </p>
      </div>

      {/* Verification Queries */}
      <div>
        <h2 className="text-2xl font-mono mb-6 text-green-500">
          {t.home.requestsTitle}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-300 dark:border-gray-700 p-5">
            <h4 className="font-mono text-green-400 mb-2">
              {t.home.requestCardTitle}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.home.requestCardBody}
            </p>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 p-5">
            <h4 className="font-mono text-green-400 mb-2">
              {t.home.executionCardTitle}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.home.executionCardBody}
            </p>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 p-5">
            <h4 className="font-mono text-green-400 mb-2">
              {t.home.responseCardTitle}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.home.responseCardBody}
            </p>
          </div>
        </div>
      </div>

      {/* Trust Model */}
      <div className="border border-gray-300 dark:border-gray-700 p-8 max-w-5xl">
        <h2 className="text-2xl font-mono mb-4 text-green-500">
          {t.home.trustTitle}
        </h2>

        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          {t.home.trustBody1}
          <br />
          <br />
          {t.home.trustBody2}
        </p>
      </div>
    </section>
  );
}
