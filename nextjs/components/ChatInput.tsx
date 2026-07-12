"use client";

import { useState } from "react";

type Props = {
  onSend: (message: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim()) return;

    onSend(input);
    setInput("");
  }

  return (
    <div className="flex gap-2 p-4 border-t">
      <input
        className="flex-1 border rounded-lg px-4 py-2"
        placeholder="Ask Fleet AI..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-5 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}