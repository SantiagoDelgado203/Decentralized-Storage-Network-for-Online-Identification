const incidents = [
  {
    date: "NOV 2025",
    title: "IDMerit KYC Leak — 1 Billion Identity Records Exposed",
    body: "Cybersecurity researchers at Cybernews discovered an unprotected MongoDB database belonging to IDMerit, an AI-powered Know Your Customer (KYC) provider used by banks and fintech firms. The 1 TB database — requiring no password to access — exposed full names, home addresses, national ID numbers, dates of birth, phone numbers, and email addresses for individuals across 26 countries, with over 203 million US records alone. The risks include SIM swapping, account takeover, and targeted phishing using verified identity attributes.",
    source: "https://cybernews.com/security/global-data-leak-exposes-billion-records/",
    tag: "KYC / Identity Verification",
  },
  {
    date: "FEB 2026",
    title: "Odido Telecom Breach — 6.2 Million Customers Exposed",
    body: "Dutch telecommunications company Odido confirmed a major breach affecting approximately 6.2 million customers — one of the largest telecom data exposures in Europe in early 2026. The ShinyHunters cybercriminal group claimed responsibility and began publishing the stolen data on dark web forums. Exposed records included full names, residential addresses, phone numbers, email addresses, bank account IBAN numbers, dates of birth, and passport and driver's license numbers.",
    source: "https://cyberprivacylab.com/recent-data-breaches-2026/",
    tag: "Telecom",
  },
  {
    date: "JAN 2025 – JAN 2026",
    title: "Conduent Business Services — SSNs and Health IDs Stolen",
    body: "Business services giant Conduent suffered a prolonged intrusion spanning from October 2024 to January 2025, during which attackers exfiltrated files containing full names, Social Security numbers, dates of birth, health insurance policy details, and government ID numbers. Downstream victims included Volvo Group North America, with nearly 17,000 of its employees and customers notified. Affected individuals were offered at least one year of identity monitoring.",
    source: "https://www.brightdefense.com/resources/recent-data-breaches/",
    tag: "Business Services / Supply Chain",
  },
  {
    date: "DEC 2025",
    title: "ManageMyHealth Portal — 400,000 Medical Documents Exfiltrated",
    body: "The ManageMyHealth online patient portal suffered unauthorized access in late December 2025, with more than 400,000 medical documents stolen and approximately 120,000 individuals affected. A threat actor identifying themselves as \"Kazu\" demanded a ransom for the stolen data. Exposed records included patient referrals, lab results, and clinical correspondence — data that can be exploited for targeted scams and identity fraud for years after the initial exposure.",
    source: "https://cyberprivacylab.com/recent-data-breaches-2026/",
    tag: "Healthcare",
  },
  {
    date: "JUL – DEC 2025",
    title: "PayPal Working Capital — Financial Identity Data Accessed for Months",
    body: "PayPal confirmed a breach tied to its Working Capital loan application after a threat actor accessed systems starting July 1, 2025. Access continued undetected until December 12, 2025 — a five-month window. Breach notification letters began reaching affected users in February 2026, with some recipients reporting unauthorized transactions. The incident exposed the identity and financial data of loan applicants who had submitted detailed personal and business information to the platform.",
    source: "https://www.brightdefense.com/resources/recent-data-breaches/",
    tag: "Fintech",
  },
  {
    date: "APR 2025",
    title: "DaVita Ransomware Attack — 2.6 Million Patient Records",
    body: "DaVita Inc., one of the largest kidney dialysis providers in the US operating over 2,600 outpatient centers, was hit by the Interlock ransomware group in a breach detected in April 2025. Over 1.5 terabytes of patient and operational data were exfiltrated, formally confirmed as affecting 2,689,826 individuals. Exposed data included names, dates of birth, addresses, and Social Security numbers — precisely the identifiers used for medical and financial identity fraud.",
    source: "https://cyberprivacylab.com/recent-data-breaches-2026/",
    tag: "Healthcare / Ransomware",
  },
];

export default function NewsPage() {
  return (
    <div className="py-8">
      {/* Header */}
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-green-400 mb-1">
        // threat intelligence
      </p>
      <h1 className="font-mono text-3xl font-bold tracking-[0.05em] text-[#a3c9a8] mb-0">
        INCIDENT LOG
      </h1>
      <p className="font-mono text-md text-[#3a5a3a] mt-2 mb-0">
        Recent breaches involving identity data — the problem DIDN was built to solve.
      </p>
      <div className="w-10 h-px bg-[#1e3320] my-4 mb-10" />

      {/* Incident list */}
      <div className="flex flex-col gap-6">
        {incidents.map((item, i) => (
          <article
            key={i}
            className="border border-[#1e3320] bg-[#0b110c] p-5 relative"
          >
            {/* Corner accents */}
            <span className="absolute top-[4px] left-[4px] w-[6px] h-[6px] border-t border-l border-green-400/30" />
            <span className="absolute top-[4px] right-[4px] w-[6px] h-[6px] border-t border-r border-green-400/30" />
            <span className="absolute bottom-[4px] left-[4px] w-[6px] h-[6px] border-b border-l border-green-400/30" />
            <span className="absolute bottom-[4px] right-[4px] w-[6px] h-[6px] border-b border-r border-green-400/30" />

            <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
              <div className="flex items-center gap-3">
                {/* Date */}
                <span className="font-mono text-[9px] tracking-[0.18em] text-green-400/60 uppercase">
                  {item.date}
                </span>
                {/* Tag */}
                <span className="font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 border border-[#1e3320] text-[#3a5a3a]">
                  {item.tag}
                </span>
              </div>
              {/* Status indicator */}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/70 animate-pulse" />
                <span className="font-mono text-[9px] text-[#5a2a2a] tracking-wider uppercase">confirmed breach</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-mono text-xl font-bold text-[#a3c9a8] tracking-wide mb-2 leading-snug">
              {item.title}
            </h2>

            {/* Body */}
            <p className="font-mono text-md text-[#5a7a5a] leading-relaxed mb-4">
              {item.body}
            </p>

            {/* Source link */}
            <a
              href={item.source}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-widest uppercase text-green-400/50 hover:text-green-400 border-b border-green-400/20 hover:border-green-400/60 transition-all duration-150 pb-px"
            >
              → VIEW SOURCE
            </a>
          </article>
        ))}
      </div>

      {/* Footer note */}
      <p className="font-mono text-[10px] text-[#2a3a2a] mt-10 tracking-wider">
        // sources: cybernews, cyberprivacylab, brightdefense — updated apr 2026
      </p>
    </div>
  );
}