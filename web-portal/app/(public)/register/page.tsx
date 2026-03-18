"use client";

import { useState } from "react";
import { register_user, register_provider } from "../../../Connectors";
import Link from "next/link";

export default function RegisterPage() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [providerEmail, setProviderEmail] = useState("");
  const [providerPassword, setProviderPassword] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [response, setResponse] = useState<string | null>(null);

  async function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await register_user({
      email: userEmail,
      password: userPassword,
    });

    setResponse(res.reply);
  }

  async function handleProviderSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await register_provider({
      email: providerEmail,
      password: providerPassword,
      companyname: companyName,
    });

    setResponse(res.reply);
  }

  return (
    <div className="flex items-center justify-center px-12">
      <div className="w-full max-w-6xl flex flex-col gap-10">

        {/* FORMS */}
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* USER FORM */}
          <form
            onSubmit={handleUserSubmit}
            className="flex flex-col gap-6 pr-12"
          >
            <h1 className="text-2xl font-semibold text-center">Register User</h1>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Email</label>
              <input
                type="email"
                placeholder="example@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="rounded-md border border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="rounded-md border border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-green-600 py-2 font-medium hover:bg-green-700 transition"
            >
              Create User
            </button>
          </form>

          {/* VERIFIER FORM */}
          <form
            onSubmit={handleProviderSubmit}
            className="flex flex-col gap-6 pl-12 border-t md:border-t-0 md:border-l border-gray-700"
          >
            <h1 className="text-2xl font-semibold text-center">Register Verifier</h1>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Company Name</label>
              <input
                type="text"
                placeholder="Company Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="rounded-md border border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Email</label>
              <input
                type="email"
                placeholder="example@example.com"
                value={providerEmail}
                onChange={(e) => setProviderEmail(e.target.value)}
                className="rounded-md border border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={providerPassword}
                onChange={(e) => setProviderPassword(e.target.value)}
                className="rounded-md border border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 font-medium hover:bg-blue-700 transition"
            >
              Create Verifier
            </button>
          </form>
        </div>

        {/* RESPONSE MESSAGE */}
        {response && (
          <div className="flex justify-center">
            <div className="px-6 py-3 rounded-lg border border-green-500 bg-green-500/10 text-green-400 font-medium text-center">
              {response}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}