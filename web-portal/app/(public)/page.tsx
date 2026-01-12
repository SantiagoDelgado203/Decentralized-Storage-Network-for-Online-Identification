"use client"
import Image from "next/image";
import Link from "next/link"

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");

  const sendRequest = async () => {
    const res = await fetch("http://localhost:5000/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    setResponse(data.reply);
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
