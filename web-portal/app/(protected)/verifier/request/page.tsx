"use client";

import { JSX, useState, useContext } from "react";
import { Criteria, Rule } from "@/Models";
import { requestVerification } from "@/Connectors";
import { AuthContext } from "@/app/context/AuthContext";

const TEST_USERID = "9a3fc47b-98b2-4d51-bb5e-a4a641812ebb";
const TEST_PROVIDERID = "6cbf4598-339d-4b4b-8d63-30c53c20c4ec";

/* -----------------------------
   FACTORY HELPERS
------------------------------*/

const createEmptyRule = (): Rule => ({
  Type: "Rule",
  Field: "",
  Operation: "equals",
  Value: ""
});

const createLogical = (type: "AND" | "OR"): Criteria => ({
  Type: type,
  Criteria: []
});

const createNot = (): Criteria => ({
  Type: "NOT"
});

/* -----------------------------
   COMPONENT
------------------------------*/

export default function VerificationBuilder() {
  const [tree, setTree] = useState<Criteria>({
    Type: "AND",
    Criteria: []
  });

  const [userId, setUserId] = useState("");
  const [selected, setSelected] = useState<Criteria | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  var context = useContext(AuthContext)

  /* -----------------------------
     ADD CHILDREN
  ------------------------------*/

  const addToLogical = (
    parent: Extract<Criteria, { Type: "AND" | "OR" }>,
    child: Criteria
  ) => {
    parent.Criteria.push(child);
    setTree({ ...tree });
  };

  const replaceNotChild = (
    parent: Extract<Criteria, { Type: "NOT" }>,
    child: Criteria
  ) => {
    // Only allow setting if empty
    if (!parent.Criteria) {
      parent.Criteria = child;
      setTree({ ...tree });
    }
  };

  /* -----------------------------
     SEND
  ------------------------------*/

  const sendVerification = async () => {
    try {
      setLoading(true);
      setResponseMsg("");

      const res = await requestVerification({
        userID: userId,
        verifierID: context?.user.id,
        company: "Company",
        criteria: tree
      });

      setResponseMsg(res.reply ?? "Request sent");
    } catch (e) {
      console.error(e);
      setResponseMsg("Error sending request");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     TREE RENDERING
  ------------------------------*/

  const renderNode = (node: Criteria, depth = 0): JSX.Element => {
    const isSelected = selected === node;

    const baseStyle = `cursor-pointer px-2 py-1 rounded text-sm ${
      isSelected ? "bg-blue-600" : "hover:bg-neutral-700"
    }`;

    return (
      <div key={Math.random()} className="flex flex-col">
        {/* LABEL */}
        <div
          onClick={() => setSelected(node)}
          className={baseStyle}
          style={{ marginLeft: depth * 16 }}
        >
          {node.Type === "Rule" && `📄 ${node.Field || "New Rule"}`}
          {(node.Type === "AND" || node.Type === "OR") &&
            `📁 ${node.Type}`}
          {node.Type === "NOT" && `🚫 NOT`}
        </div>

        {/* CHILDREN */}
        {node.Type === "AND" || node.Type === "OR"
          ? node.Criteria.map((child, i) => (
              <div key={i}>{renderNode(child, depth + 1)}</div>
            ))
          : node.Type === "NOT" && node.Criteria
          ? renderNode(node.Criteria, depth + 1)
          : null
        }

        {/* ADD BUTTONS */}
        {(node.Type === "AND" || node.Type === "OR") && (
          <div
            className="flex gap-2 mt-1"
            style={{ marginLeft: depth * 16 + 16 }}
          >
            <button
              className="text-xs bg-neutral-700 px-2 rounded"
              onClick={() => addToLogical(node, createEmptyRule())}
            >
              + Rule
            </button>
            <button
              className="text-xs bg-neutral-700 px-2 rounded"
              onClick={() => addToLogical(node, createLogical("AND"))}
            >
              + AND
            </button>
            <button
              className="text-xs bg-neutral-700 px-2 rounded"
              onClick={() => addToLogical(node, createLogical("OR"))}
            >
              + OR
            </button>
            <button
              className="text-xs bg-neutral-700 px-2 rounded"
              onClick={() => addToLogical(node, createNot())}
            >
              + NOT
            </button>
          </div>
        )}

        {node.Type === "NOT" && !node.Criteria && (
          <div
            className="flex gap-2 mt-1"
            style={{ marginLeft: depth * 16 + 16 }}
          >
            <button
              className="text-xs bg-neutral-700 px-2 rounded"
              onClick={() => replaceNotChild(node, createEmptyRule())}
            >
              Rule
            </button>

            <button
              className="text-xs bg-neutral-700 px-2 rounded"
              onClick={() => replaceNotChild(node, createLogical("AND"))}
            >
              AND
            </button>

            <button
              className="text-xs bg-neutral-700 px-2 rounded"
              onClick={() => replaceNotChild(node, createLogical("OR"))}
            >
              OR
            </button>

            <button
              className="text-xs bg-neutral-700 px-2 rounded"
              onClick={() => replaceNotChild(node, createNot())}
            >
              NOT
            </button>
          </div>
        )}
      </div>
    );
  };

  /* -----------------------------
     RIGHT PANEL FORM
  ------------------------------*/

  const updateRule = (
    field: "Field" | "Operation" | "Value",
    value: string | Number
  ) => {
    if (!selected || selected.Type !== "Rule") return;

    if (field === "Field") {
      selected.Field = value as string;
    }

    if (field === "Operation") {
      selected.Operation = value as Rule["Operation"];
    }

    if (field === "Value") {
      selected.Value = value;
    }

    setTree({ ...tree });
  };

  const renderForm = () => {
    if (!selected)
      return <div className="text-neutral-400">Select a node</div>;

    if (selected.Type === "Rule") {
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label>Field</label>
            <input
              className="w-full bg-neutral-800 p-2 rounded"
              value={selected.Field}
              onChange={(e) =>
                updateRule("Field", e.target.value)
              }
            />
          </div>

          <div>
            <label>Operation</label>
            <select
              className="w-full bg-neutral-800 p-2 rounded"
              value={selected.Operation}
              onChange={(e) =>
                updateRule(
                  "Operation",
                  e.target.value as Rule["Operation"]
                )
              }
            >
              <option value="equals">equals</option>
              <option value="minimum">minimum</option>
              <option value="maximum">maximum</option>
            </select>
          </div>

          <div>
            <label>Value</label>
            <input
              className="w-full bg-neutral-800 p-2 rounded"
              value={selected.Value as string}
              onChange={(e) =>
                updateRule("Value", e.target.value)
              }
            />
          </div>
        </div>
      );
    }

    if (selected.Type === "AND" || selected.Type === "OR") {
      return (
        <div>
          <h3 className="text-xl">{selected.Type} Group</h3>
          <p className="text-neutral-400">
            Combines children using {selected.Type}.
          </p>
        </div>
      );
    }

    if (selected.Type === "NOT") {
      return (
        <div>
          <h3 className="text-xl">NOT Expression</h3>
          <p className="text-neutral-400">
            Negates its single child expression.
          </p>
        </div>
      );
    }
  };

  /* -----------------------------
     UI
  ------------------------------*/

  return (
    <div className="w-11/12 mx-auto">
      <div className=" flex flex-row justify-between my-5">
        <h2 className=" text-4xl">
          Verification Request Builder
        </h2>
        
        <div className=" flex gap-4 items-center">
          <div className=" flex flex-col">
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-neutral-800 px-3 py-2 rounded text-sm w-sm"
            />
            {responseMsg && (
              <span className="text-sm text-green-400">
                {responseMsg}
              </span>
            )}
          </div>

          <button
            onClick={sendVerification}
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Sending..." : "Request Verification"}
          </button>
        </div>
      </div>
      
      <div className="flex bg-neutral-900 h-fit rounded-2xl overflow-hidden">
        <div className="w-1/3 p-6 border-r border-neutral-800 overflow-auto">
          {renderNode(tree)}
        </div>
        <div className="w-2/3 p-8 bg-neutral-950">
          {renderForm()}
        </div>
      </div>
      <pre className="mt-6 text-xs bg-neutral-900 p-4 rounded-xl">
        {JSON.stringify(tree, null, 2)}
      </pre>
    </div>
  );
}
