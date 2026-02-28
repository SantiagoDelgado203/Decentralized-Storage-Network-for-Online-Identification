"use client";

import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col gap-20">

      {/* Hero */}
      <div className="flex flex-col gap-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-mono font-semibold">
          Decentralized Verification Network
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          A system where user data is verified once by a trusted authority,
          then encrypted, distributed, and enforced by decentralized nodes.
        </p>

        <div className="flex gap-4 mt-4">
          <Link
            href="/docs"
            className="px-6 py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition font-mono"
          >
            Read Docs
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 border border-gray-400 dark:border-gray-600 hover:border-green-500 hover:text-green-400 transition font-mono"
          >
            Join Network
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300 dark:bg-gray-700" />

      {/* Overview */}
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-mono mb-4 text-green-500">
            What This Network Does
          </h2>

          <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
            The network provides privacy-preserving verification of user data.
            A single trusted authority verifies user information exactly once.
            <br /><br />
            After verification, the data is encrypted and submitted to a
            decentralized network of independent nodes that store and enforce
            verification logic without learning the underlying data.
          </p>
        </div>

        <div className="border border-gray-300 dark:border-gray-700 p-6">
          <h3 className="font-mono mb-3 text-green-400">
            Design Guarantees
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-400 list-disc list-inside">
            <li>One-time trusted verification</li>
            <li>Decentralized custody of data</li>
            <li>Encrypted data and key material</li>
            <li>Auditable and compliant nodes</li>
            <li>Binary (yes / no) responses only</li>
          </ul>
        </div>
      </div>

      {/* Trusted Authority */}
      <div className="max-w-5xl">
        <h2 className="text-2xl font-mono mb-4 text-green-500">
          Trusted Verification Authority
        </h2>

        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          A single, highly trusted authority is responsible for verifying
          user-provided data (such as identity attributes or credentials).
          <br /><br />
          This verification happens once. After submission to the network,
          the authority no longer participates in storage, retrieval, or
          decision-making.
        </p>
      </div>

      {/* Storage & Encryption */}
      <div className="max-w-5xl">
        <h2 className="text-2xl font-mono mb-4 text-green-500">
          Encrypted & Distributed Storage
        </h2>

        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          Verified data is encrypted before being distributed across a set of
          independent nodes operated by unrelated parties.
          <br /><br />
          Encryption keys are also protected and distributed such that no
          single node can access or reconstruct the underlying data on its own.
        </p>
      </div>

      {/* Verification Queries */}
      <div>
        <h2 className="text-2xl font-mono mb-6 text-green-500">
          Verification Requests
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-300 dark:border-gray-700 p-5">
            <h4 className="font-mono text-green-400 mb-2">Request</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A verifier submits a request for a specific condition
              (e.g. “Is user over 18?”).
            </p>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 p-5">
            <h4 className="font-mono text-green-400 mb-2">Execution</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Nodes temporarily reconstruct access to encrypted material
              to evaluate the condition.
            </p>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 p-5">
            <h4 className="font-mono text-green-400 mb-2">Response</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Only a yes/no result is returned — no data is revealed.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Model */}
      <div className="border border-gray-300 dark:border-gray-700 p-8 max-w-5xl">
        <h2 className="text-2xl font-mono mb-4 text-green-500">
          Trust & Security Model
        </h2>

        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          The system relies on a minimal trust assumption: the initial
          verification authority is trusted to verify data correctly.
          <br /><br />
          After that point, decentralization ensures that no single entity can
          access, modify, or misuse user data — including the authority itself.
        </p>
      </div>

    </section>
  );
}
