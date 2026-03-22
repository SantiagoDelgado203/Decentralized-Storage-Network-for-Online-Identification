"use client";

import { useState } from "react";
import { Criteria } from "@/Models";

export default function RequestCard({
  req,
  processingId,
  verifyResult,
  onAccept,
  onDecline,
  mode = "user",
}: {
  req: any;
  processingId: string | null;
  verifyResult: any;
  onAccept?: (req: any) => void;
  onDecline?: (id: string, criteria: Criteria) => void;
  mode?: "user" | "verifier";
}) {
  const [showCriteria, setShowCriteria] = useState(false);

  const isPending = req.status === "Pending";
  const isUserMode = mode === "user";

  return (
    <div className="bg-gray-950 border rounded-2xl shadow-lg shadow-green-950/5 hover:shadow-green-900/10 transition-all duration-300 p-7">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-5 text-white">
        <div>
          <h3 className="text-xl font-semibold">{req.companyname}</h3>
          <p className="text-sm mt-1">Request ID: {req.requestid}</p>
          <p className="text-sm mt-1">User ID: {req.userid}</p>
        </div>

        <span
          className={`px-4 py-1.5 text-sm font-medium rounded-full ${
            req.status === "Pending"
              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
              : req.status === "Accepted" ||
                req.status === "Verified Successfully: Yes"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {req.status}
        </span>
      </div>

      {/* Criteria (Collapsible) */}
      <div>
        <button
          onClick={() => setShowCriteria((prev) => !prev)}
          className="w-full flex justify-between items-center text-sm font-medium text-gray-400 uppercase tracking-wide mb-2 hover:text-white transition"
        >
          <span>Verification Criteria</span>
          <span className="text-xs hover:cursor-pointer">
            {showCriteria ? "▲ Hide" : "▼ Show"}
          </span>
        </button>

        {showCriteria && (
          <pre className="bg-gray-50 border text-sm p-4 my-2 rounded-xl overflow-x-auto text-gray-700">
            {JSON.stringify(req.datarequests, null, 2)}
          </pre>
        )}
      </div>

      {/* Buttons (ONLY in user mode + pending) */}
      {isUserMode && isPending && (
        <div className="flex gap-4">
          <button
            disabled={processingId === req.requestid}
            onClick={() => onAccept?.(req)}
            className="px-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {processingId === req.requestid
              ? "Processing..."
              : "Accept Request"}
          </button>

          <button
            disabled={processingId === req.requestid}
            onClick={() =>
              onDecline?.(req.requestid, req.datarequests)
            }
            className="px-3 py-1 rounded-xl border border-red-500 text-red-600 font-medium hover:bg-red-50 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {processingId === req.requestid
              ? "Processing..."
              : "Decline"}
          </button>
        </div>
      )}

      {/* Verification Result */}
      {req.requestid === processingId && verifyResult && (
        <div className="mt-10 bg-gray-900 border border-green-500/30 rounded-2xl p-8 shadow-lg shadow-green-900/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Verification Result
          </h2>

          <div className="h-1 w-16 bg-green-500 mb-6 rounded-full" />

          <pre className="bg-black/40 border border-green-500/20 text-green-400 p-6 rounded-xl overflow-x-auto text-sm">
            {JSON.stringify(verifyResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}