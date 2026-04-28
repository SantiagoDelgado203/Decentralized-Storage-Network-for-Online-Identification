export default function AboutPage() {
  const team = [
    {
      initials: "SD",
      name: "Santiago Delgado",
      role: "Team Leader & Software Architect",
      bio: "Designed the core decentralized identity protocol and built the automated nodes that process verification request, as well as the communication channels with the Trusted Authority.",
    },
    {
      initials: "KD",
      name: "Kanish Dangol",
      role: "Deployment Specialist",
      bio: "Adapted the project for containerization and easy high-volume deployment in testing environments with Docker. Also applied tools for monitoring the network's health.",
    },
    {
      initials: "SS",
      name: "Syed Shah",
      role: "Security Analyst",
      bio: "Designed and implemented the cryptography tools used for data protection, as well as participating in the design of data sharding in the network.",
    },
    {
      initials: "SM",
      name: "Shiqiang Mo",
      role: "Full Stack Dev",
      bio: "Worked on the the design and implementation of the nodes databases, while also adding improvements to the web portal visuals for demonstration.",
    },
    {
      initials: "BG",
      name: "Xuan Gia Bao Nguyen",
      role: "Full Stack Dev",
      bio: "Designed and implemented the SQL database for the web portal, while also working on the UI and UX for ease of use and demonstration.",
    },
  ];

  return (
    <div className="py-8">
      {/* Header */}
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-green-400 mb-1">
        // who we are
      </p>
      <h1 className="font-mono text-2xl font-bold tracking-[0.05em] text-[#a3c9a8] mb-0">
        THE TEAM
      </h1>
      <div className="w-10 h-px bg-[#1e3320] my-4 mb-10" />

      {/* Team grid */}
      <div className="grid grid-cols-5 gap-5">
        {team.map((member) => (
          <div key={member.initials} className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative w-[88px] h-[88px] mb-4">
              <div className="w-full h-full border border-[#1e3320] bg-[#0d1a10] flex items-center justify-center relative overflow-hidden">
                {/* Scanlines overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,200,80,0.03) 3px, rgba(0,200,80,0.03) 4px)",
                  }}
                />
                {/* Corner brackets */}
                <span className="absolute top-[3px] left-[3px] w-[6px] h-[6px] border-t border-l border-green-400/50" />
                <span className="absolute top-[3px] right-[3px] w-[6px] h-[6px] border-t border-r border-green-400/50" />
                <span className="absolute bottom-[3px] left-[3px] w-[6px] h-[6px] border-b border-l border-green-400/50" />
                <span className="absolute bottom-[3px] right-[3px] w-[6px] h-[6px] border-b border-r border-green-400/50" />
                {/* Initials */}
                <span className="font-mono text-[22px] font-bold text-green-400 z-10">
                  {member.initials}
                </span>
              </div>
            </div>

            {/* Name */}
            <p className="font-mono text-[12px] font-bold text-[#a3c9a8] tracking-[0.08em] uppercase mb-[3px]">
              {member.name}
            </p>

            {/* Role */}
            <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-green-400 mb-[10px]">
              {member.role}
            </p>

            {/* Status dot */}
            <div className="flex items-center justify-center gap-1.5 mb-[6px]">
              <span className="w-1 h-1 rounded-full bg-green-400 opacity-70" />
              <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[#2a4a2a]">
                online
              </span>
            </div>

            {/* Bio */}
            <p className="font-mono text-[11px] text-[#5a7a5a] leading-relaxed">
              {member.bio}
            </p>
          </div>
        ))}
      </div>
      <br /><br />
      {/* <h1 className="font-mono text-2xl font-bold tracking-[0.05em] text-[#a3c9a8] mb-0">
        SPONSOR
      </h1> */}
    </div>
  );
}