"use client";

import { useState } from "react";
import { requestVerification } from "@/Connectors";

export type Rule = {
  Field: string;
  Type: "equals" | "minimum";
  Value: any;
};

export type Criteria = {
  All: Rule[];
  Any: Rule[];
};


  const OperatorSelect = ({
    value,
    onChange,
  }: {
    value: "equals" | "minimum";
    onChange: (v: "equals" | "minimum") => void;
  }) => (
    <select
      className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
      value={value}
      onChange={(e) => onChange(e.target.value as any)}
    >
      <option value="equals">Equals</option>
      <option value="minimum">Minimum</option>
    </select>
  );

  const LogicSelect = ({
    value,
    onChange,
  }: {
    value: "All" | "Any";
    onChange: (v: "All" | "Any") => void;
  }) => (
    <select
      className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
      value={value}
      onChange={(e) => onChange(e.target.value as any)}
    >
      <option value="All">ALL (AND)</option>
      <option value="Any">ANY (OR)</option>
    </select>
  );

  const FieldBlock = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div className="space-y-2 border border-neutral-800 p-4 rounded-xl">
      {children}
    </div>
  );

export default function Verify() {
  // Value states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  // Operator states
  const [nameOp, setNameOp] = useState<"equals" | "minimum">("equals");
  const [addressOp, setAddressOp] = useState<"equals" | "minimum">("equals");
  const [genderOp, setGenderOp] = useState<"equals" | "minimum">("equals");
  const [ageOp, setAgeOp] = useState<"equals" | "minimum">("equals");

  // Logic states
  const [nameLogic, setNameLogic] = useState<"All" | "Any">("All");
  const [addressLogic, setAddressLogic] = useState<"All" | "Any">("All");
  const [genderLogic, setGenderLogic] = useState<"All" | "Any">("All");
  const [ageLogic, setAgeLogic] = useState<"All" | "Any">("All");

  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendUserData = async () => {
    try {
      setLoading(true);

      const criteria: Criteria = { All: [], Any: [] };

      const pushRule = (
        field: string,
        type: "equals" | "minimum",
        value: any,
        logic: "All" | "Any"
      ) => {
        criteria[logic].push({
          Field: field,
          Type: type,
          Value: value,
        });
      };

      // Only push if field has value

      if (name.trim() !== "")
        pushRule("Name", nameOp, name.trim(), nameLogic);

      if (gender !== "")
        pushRule("Gender", genderOp, gender, genderLogic);

      if (address.trim() !== "")
        pushRule("Address", addressOp, address.trim(), addressLogic);

      if (age !== "")
        pushRule("Age", ageOp, Number(age), ageLogic);

      const res = await requestVerification({
        userID: "9a3fc47b-98b2-4d51-bb5e-a4a641812ebb",
        verifierID: "6cbf4598-339d-4b4b-8d63-30c53c20c4ec",
        company: "Facebook",
        criteria: criteria,
      });

      setResponse(JSON.stringify(res.reply, null, 2));
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
        <h1 className="text-2xl font-mono text-neutral-100 mb-6">
          Build Verification Rules
        </h1>

        <div className="space-y-6">

          {/* NAME */}
          <FieldBlock>
            <input
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-100"
              placeholder="Full Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex gap-2">
              <OperatorSelect value={nameOp} onChange={setNameOp} />
              <LogicSelect value={nameLogic} onChange={setNameLogic} />
            </div>
          </FieldBlock>

          {/* GENDER */}
          <FieldBlock>
            <select
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-100"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Gender (optional)</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="X">Nonbinary</option>
            </select>
            <div className="flex gap-2">
              <OperatorSelect value={genderOp} onChange={setGenderOp} />
              <LogicSelect value={genderLogic} onChange={setGenderLogic} />
            </div>
          </FieldBlock>

          {/* ADDRESS */}
          <FieldBlock>
            <input
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-100"
              placeholder="Address (optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="flex gap-2">
              <OperatorSelect value={addressOp} onChange={setAddressOp} />
              <LogicSelect value={addressLogic} onChange={setAddressLogic} />
            </div>
          </FieldBlock>

          {/* AGE */}
          <FieldBlock>
            <input
              type="number"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-100"
              placeholder="Age (optional)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <div className="flex gap-2">
              <OperatorSelect value={ageOp} onChange={setAgeOp} />
              <LogicSelect value={ageLogic} onChange={setAgeLogic} />
            </div>
          </FieldBlock>

          <button
            onClick={sendUserData}
            disabled={loading}
            className="w-full bg-emerald-500 text-black font-mono py-2.5 rounded-lg"
          >
            {loading ? "Submitting…" : "Verify"}
          </button>

          {response && (
            <pre className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-emerald-400 text-sm overflow-auto">
              {response}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}