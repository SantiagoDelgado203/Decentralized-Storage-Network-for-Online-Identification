import { getDict, pickLang } from "@/lib/i18n";

export default async function HelpPage(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await props.searchParams;
  const l = pickLang(lang);
  const t = await getDict(l);

  // ✅ 如果对应语言没有 help，就回退到原英文内容
  const h = t?.help;

  // ✅ 原始英文内容（不改）
  const faqsDefault = [
    {
      q: "How does DIDN protect my personal data?",
      a: "DIDN minimizes exposure by encrypting verification artifacts and distributing them across nodes. Only policy-compliant results are returned during checks.",
    },
    {
      q: "What is a verification request?",
      a: "A verifier asks for proof of an attribute (e.g., age over 18). The system returns a yes/no or policy-compliant proof without revealing raw data.",
    },
    {
      q: "Why do I see Pending / History on my dashboard?",
      a: "Pending items are requests awaiting action. History shows completed outcomes for your records.",
    },
    {
      q: "I selected the wrong language. How do I change it?",
      a: "Use the language selector in the top navigation. The selected language is kept in the URL parameter (?lang=...).",
    },
  ];

  const stepsDefault = [
    "Create an account (User or Verifier)",
    "Complete your profile info",
    "View requests in your dashboard",
  ];

  const actionsDefault = [
    "Review pending verification requests",
    "Track completed results in history",
    "Update account/profile details",
  ];

  const checklistDefault = ["Page URL", "Steps to reproduce", "Console error (if any)"];

  // ✅ 如果 JSON 有翻译就用，没有就用默认英文
  const faqs = (h?.faqs ?? faqsDefault) as Array<{ q: string; a: string }>;
  const steps = (h?.gettingStartedSteps ?? stepsDefault) as string[];
  const actions = (h?.commonActions ?? actionsDefault) as string[];
  const checklist = (h?.supportChecklist ?? checklistDefault) as string[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          {h?.title ?? "Help"}
        </h1>
        <p className="text-slate-600">
          {h?.subtitle ??
            "Quick guidance for using the DIDN Portal. If something looks unclear, check FAQs first."}
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            {h?.gettingStartedTitle ?? "Getting Started"}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {steps.map((s, idx) => (
              <li key={s}>
                <span className="font-medium text-slate-900">{idx + 1})</span> {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            {h?.commonActionsTitle ?? "Common Actions"}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {actions.map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            {h?.supportTitle ?? "Support"}
          </h2>
          <p className="mt-4 text-sm text-slate-700">
            {h?.supportBody ??
              "If you run into issues, capture a screenshot and note your URL (including ?lang=...)."}
          </p>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-medium text-slate-900">
              {h?.supportChecklistTitle ?? "Helpful info to include:"}
            </div>
            <ul className="mt-2 space-y-1">
              {checklist.map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {h?.faqTitle ?? "FAQ"}
        </h2>
        <div className="mt-4 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-slate-200 p-4">
              <div className="font-medium text-slate-900">{f.q}</div>
              <div className="mt-2 text-sm text-slate-700">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}