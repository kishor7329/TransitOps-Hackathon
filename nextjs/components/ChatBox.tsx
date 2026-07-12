"use client";

import { useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I am Fleet AI. Ask me anything about your fleet.",
    },
  ]);

  async function sendMessage(question: string) {
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.answer,
      },
    ]);
  }

  return (
    <div className="max-w-3xl mx-auto h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((msg, index) => (
          <Message
            key={index}
            role={msg.role}
            content={msg.content}
          />
        ))}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}