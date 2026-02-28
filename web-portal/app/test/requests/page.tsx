"use client";

import { useEffect, useState } from "react";
import { getRequests, verify, resolveRequest } from "@/Connectors";


export default function RequestsView() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<any | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []); 

  async function fetchRequests() {
    try {
      const data = await getRequests({ userID: "9a3fc47b-98b2-4d51-bb5e-a4a641812ebb" });
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(request: any) {
  try {
      
    await resolveRequest({
        requestID: request.requestid,
        accepted: true,
    });
    
    const result = await verify({
        requestid: request.requestid,
        userID: request.userid,
        criteria: request.datarequests,
    });
        
    setProcessingId(request.requestid);

    setVerifyResult(result);

    fetchRequests();
  } catch (err) {
    console.error("Error accepting request:", err);
  } finally {
    setProcessingId(null);
  }
}

  async function handleDecline(requestID: string) {
    try {
      setProcessingId(requestID);

      await resolveRequest({
        requestID,
        accepted: false,
      });

      fetchRequests();
    } catch (err) {
      console.error("Error declining request:", err);
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-lg">Loading requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-400 text-lg">No pending requests.</p>
      </div>
    );
  }

  return (
  <div className="max-w-4xl mx-auto">
    {/* Page Title */}
    <div className="mb-10">
      <h1 className="text-3xl font-semibold tracking-tight ">
        Verification Requests
      </h1>
      <div className="h-1 w-20 bg-green-500 mt-3 rounded-full" />
    </div>

    <div className="space-y-6">
      {requests.map((req) => (
        <div
          key={req.requestid}
          className=" bg-gray-950 border rounded-2xl shadow-lg shadow-green-950/5 hover:shadow-green-900/10 transition-all duration-300 p-7"
        >
            {/* Header Row */}
            <div className="flex justify-between items-start mb-5 text-white">
                <div>
                <h3 className="text-xl font-semibold ">
                    {req.companyname}
                </h3>
                <p className="text-sm  mt-1">
                    Request ID: {req.requestid}
                </p>
                </div>

                <span
                className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                    req.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : (req.status === "Accepted" || req.status === "Verified Successfully: Yes")
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
                >
                {req.status}
                </span>
            </div>

            {/* Criteria Section */}
            <div className="mb-6">
                <p className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
                Verification Criteria
                </p>

                <pre className="bg-gray-50 border text-sm p-4 rounded-xl overflow-x-auto text-gray-700">
                {JSON.stringify(req.datarequests, null, 2)}
                </pre>
            </div>

            {/* Action Buttons */}
            {req.status === "Pending" && (
                <div className="flex gap-4">
                <button
                    disabled={processingId === req.requestid}
                    onClick={() => handleAccept(req)}
                    className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 active:scale-95 transition-all duration-200 disabled:opacity-50"
                >
                    {processingId === req.requestID
                    ? "Processing..."
                    : "Accept Request"}
                </button>

                <button
                    disabled={processingId === req.requestid}
                    onClick={() => handleDecline(req.requestid)}
                    className="px-6 py-2.5 rounded-xl border border-red-500 text-red-600 font-medium hover:bg-red-50 active:scale-95 transition-all duration-200 disabled:opacity-50"
                >
                    {processingId === req.requestID
                    ? "Processing..."
                    : "Decline"}
                </button>
                </div>
            )}

            {/* Verification Result Section */}
            {(req.requestid == processingId) && (
            <div className="mt-14 bg-gray-900 border border-green-500/30 rounded-2xl p-8 shadow-lg shadow-green-900/20">
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
      ))}
    </div>
  </div>
);
}