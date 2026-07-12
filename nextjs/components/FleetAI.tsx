"use client";

import { useState } from "react";

export default function FleetAI() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { role: string; text: string }[]
  >([
    {
      role: "assistant",
      text: "Hi! I'm Fleet AI. Ask me anything about your fleet.",
    },
  ]);

  async function sendMessage() {
    if (!question.trim()) return;

    const userMessage = question;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setQuestion("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: userMessage,
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: data.answer,
      },
    ]);
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-emerald-600 text-white text-3xl shadow-xl"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] rounded-xl bg-white shadow-2xl border flex flex-col">

          <div className="bg-emerald-600 text-white p-4 font-bold">
            Fleet AI Assistant
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  m.role === "user"
                    ? "bg-blue-600 text-white ml-10"
                    : "bg-gray-200 mr-10"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="p-3 flex gap-2 border-t">
            <input
              className="flex-1 border rounded-lg px-3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Fleet AI..."
            />

            <button
              onClick={sendMessage}
              className="bg-emerald-600 text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}