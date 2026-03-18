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
  const pendingRequests = requests.filter(
        (req) => req.status === "Pending"
      );

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
        ) : pendingRequests.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-400 text-lg">No pending requests.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingRequests.map((req) => (
              <RequestCard
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

        <div className="flex flex-col min-h-52 bg-gray-900 rounded-xl p-5">
          Additional info....
        </div>
      </div>

    </div>
  );
}