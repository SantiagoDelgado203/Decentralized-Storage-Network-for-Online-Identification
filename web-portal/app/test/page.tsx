"use client"
import Image from "next/image";
import Link from "next/link"
import { sendUserData } from "@/Connectors";
import { TestUserInfo } from "@/Models";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");

  const sendRequest = async () => {
    const test: TestUserInfo ={
      Name : "Santiago",
      DOB : {
        year : 2003,
        month: 9,
        day: 2
      },
      Address : "123 Fake Street, WPB, FL, USA"
    }
    const res = sendUserData(test)
    setResponse(await res);
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
