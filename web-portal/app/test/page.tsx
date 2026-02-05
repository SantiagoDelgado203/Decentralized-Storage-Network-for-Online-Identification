"use client"
import Image from "next/image";
import Link from "next/link"
import { requestVerification, sendUserData } from "@/Connectors";
import { TestUserInfo, Criteria, Rule } from "@/Models";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");

  const sendRequest = async () => {
    
    // const test: TestUserInfo ={
    //   Name : "Santiago",
    //   DOB : {
    //     year : 2003,
    //     month: 9,
    //     day: 2
    //   },
    //   Address : "123 Fake Street, WPB, FL, USA"
    // }
    // const res = sendUserData(test)
    const criteria: Criteria = {
      All: [
        {Field: "name", Type: "equal", value: "Santiago"}
      ],
      Any: []
    }
    console.log("Yo")
    const res = await requestVerification("9a3fc47b-98b2-4d51-bb5e-a4a641812ebb", "6cbf4598-339d-4b4b-8d63-30c53c20c4ec", "Facebook",criteria)
    setResponse(res);
  };

  return (
    <div className=" bg-gray-800" style={{ padding: "2rem" }}>
      <h1>POST Test</h1>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something"
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      />

      <button onClick={sendRequest}>Send</button>

      {response && (
        <p style={{ marginTop: "1rem" }}>
          <strong>Response:</strong> {response}
        </p>
      )}
    </div>
  );
}
