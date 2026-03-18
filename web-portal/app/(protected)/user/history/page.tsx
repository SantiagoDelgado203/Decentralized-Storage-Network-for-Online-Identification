"use client";

import { useContext, useEffect, useState } from "react";
import { getRequests, verify, resolveRequest, updateRequest } from "@/Connectors";
import { AuthContext } from "../../../context/AuthContext";
import RequestCard from "@/app/RequestCard";
import { Criteria } from "@/Models";

export default function Dashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<any | null>(null);
  var context = useContext(AuthContext);

  const nonPendingRequests = requests.filter(
    (req) => req.status !== "Pending"
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

  async function handleDecline(requestID: string, criteria: Criteria) {
    try {
      setProcessingId(requestID);

      await updateRequest({
        requestID,
        criteria,
        status: "Declined",
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
      
      <div className="basis-7/12">
        <h1 className="text-2xl font-bold mb-6">Resolved Requests</h1>

        {loading ? (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500 text-lg">Loading requests...</p>
            </div>
            ) : nonPendingRequests.length === 0 ? (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-400 text-lg">No processed requests.</p>
            </div>
            ) : (
            <div className="space-y-6">
                {nonPendingRequests.map((req) => (
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


    </div>
  );
}