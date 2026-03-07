"use client";

import { useContext, useEffect, useState } from "react";
import { getRequests, verify, resolveRequest } from "@/Connectors";
import { AuthContext } from "../../../context/AuthContext";

export default function Dashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<any | null>(null);
  var context = useContext(AuthContext);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const data = await getRequests({
        userID: context?.user.id,
      });
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(request: any) {
    try {
      setProcessingId(request.requestid);

      const result = await verify({
        requestid: request.requestid,
        userID: request.userid,
        criteria: request.datarequests,
      });

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

  return (
    <div className="flex flex-col md:flex-row md:justify-evenly gap-10 p-6">
      
      {/* LEFT SIDE — REQUESTS */}
      <div className="basis-7/12">
        <h1 className="text-2xl font-bold mb-6">Pending Requests</h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 text-lg">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-400 text-lg">No pending requests.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req.requestid}
                className="bg-gray-950 border rounded-2xl shadow-lg shadow-green-950/5 hover:shadow-green-900/10 transition-all duration-300 p-7"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-5 text-white">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {req.companyname}
                    </h3>
                    <p className="text-sm mt-1">
                      Request ID: {req.requestid}
                    </p>
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

                {/* Criteria */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
                    Verification Criteria
                  </p>

                  <pre className="bg-gray-50 border text-sm p-4 rounded-xl overflow-x-auto text-gray-700">
                    {JSON.stringify(req.datarequests, null, 2)}
                  </pre>
                </div>

                {/* Buttons */}
                {req.status === "Pending" && (
                  <div className="flex gap-4">
                    <button
                      disabled={processingId === req.requestid}
                      onClick={() => handleAccept(req)}
                      className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 active:scale-95 transition-all duration-200 disabled:opacity-50"
                    >
                      {processingId === req.requestid
                        ? "Processing..."
                        : "Accept Request"}
                    </button>

                    <button
                      disabled={processingId === req.requestid}
                      onClick={() => handleDecline(req.requestid)}
                      className="px-6 py-2.5 rounded-xl border border-red-500 text-red-600 font-medium hover:bg-red-50 active:scale-95 transition-all duration-200 disabled:opacity-50"
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
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE PANEL */}
      <div className="basis-4/12">
        <h1 className="text-2xl font-bold mb-6">
          Account Information
        </h1>

        <div className="flex flex-col min-h-52 bg-gray-900 rounded-xl p-5">
          Additional info....
        </div>
      </div>

    </div>
  );
}