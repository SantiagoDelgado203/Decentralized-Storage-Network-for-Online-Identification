"use client";

import { useContext, useEffect, useState } from "react";
import { getRequests, verify, resolveRequest } from "@/Connectors";
import { AuthContext } from "../../../context/AuthContext";
import RequestCard from "@/app/RequestCard";

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
        verifierID: context?.user.id,
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
      <div className="basis-7/12 sticky">
        <h1 className="text-2xl font-bold mb-6">All Requests</h1>

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
              <RequestCard
                mode="verifier"
                key={req.requestid}
                req={req}
                processingId={processingId}
                verifyResult={verifyResult}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE PANEL */}
      <div className="basis-4/12">
        <h1 className="text-2xl font-bold mb-6">
          Account Information
        </h1>

        <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-6 shadow-lg space-y-5">
          
          {/* User Info */}
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-white font-medium break-all">
              {context?.user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Network ID</p>
            <p className="text-white font-medium">
              {context?.user.id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Account Type</p>
            <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
              {context?.user.type}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-4">
            <p className="text-sm text-gray-400 mb-2">What you can do</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              This account can submit verification requests to the network by specifying the exact criteria needed for validation.
              Once a request is processed, you will receive a simple boolean response indicating whether the user meets the required conditions, without exposing their underlying data.
              This ensures secure and privacy-preserving verification.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}