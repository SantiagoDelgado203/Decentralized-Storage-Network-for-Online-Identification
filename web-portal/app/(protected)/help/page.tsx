export default function HelpPage() {
  const faqs = [
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

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">Help</h1>
        <p className="text-slate-600">
          Quick guidance for using the DIDN Portal. If something looks unclear, check FAQs first.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Getting Started</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>
              <span className="font-medium text-slate-900">1)</span> Create an account (User or Verifier)
            </li>
            <li>
              <span className="font-medium text-slate-900">2)</span> Complete your profile info
            </li>
            <li>
              <span className="font-medium text-slate-900">3)</span> View requests in your dashboard
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Common Actions</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>• Review pending verification requests</li>
            <li>• Track completed results in history</li>
            <li>• Update account/profile details</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Support</h2>
          <p className="mt-4 text-sm text-slate-700">
            If you run into issues, capture a screenshot and note your URL (including ?lang=...).
          </p>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-medium text-slate-900">Helpful info to include:</div>
            <ul className="mt-2 space-y-1">
              <li>• Page URL</li>
              <li>• Steps to reproduce</li>
              <li>• Console error (if any)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">FAQ</h2>
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