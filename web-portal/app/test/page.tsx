"use client";

import { useState } from "react";
import { uploadUserData } from "@/Connectors";
import { TestUserInfo } from "@/Models";

export default function Home() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendUserData = async () => {
    const payload: TestUserInfo = {
      Name: name,
      Address: address,
      DOB: {
        year: Number(year),
        month: Number(month),
        day: Number(day),
      },
    };

    try {
      setLoading(true);
      const res = await uploadUserData(payload);
      setResponse(JSON.stringify(res, null, 2));
    } catch (err) {
      console.error(err);
      setResponse("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-mono tracking-wide text-neutral-100 mb-6">
          Submit User Data
        </h1>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Full Name
            </label>
            <input
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-100
                         focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Santiago Delgado"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Address
            </label>
            <input
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-100
                         focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Fake Street, WPB, FL"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Date of Birth
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: year, s: setYear, p: "YYYY" },
                { v: month, s: setMonth, p: "MM" },
                { v: day, s: setDay, p: "DD" },
              ].map(({ v, s, p }) => (
                <input
                  key={p}
                  type="number"
                  placeholder={p}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100
                             focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
                  value={v}
                  onChange={(e) => s(e.target.value)}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={sendUserData}
            disabled={loading}
            className="w-full mt-6 bg-emerald-500/90 hover:bg-emerald-500
                       text-neutral-950 font-mono tracking-wide py-2.5 rounded-lg
                       transition disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit"}
          </button>

          {/* Response */}
          {response && (
            <pre className="mt-4 bg-neutral-950 border border-neutral-800 rounded-lg p-4
                            text-emerald-400 text-sm overflow-auto">
              {response}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
