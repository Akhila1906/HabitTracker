// src/components/ChatBot.tsx
import React, { useState, useRef, useEffect } from "react";
import { sendGeminiMessage } from "./openai";
import ReactMarkdown from "react-markdown";
import { RiRobot2Line } from "react-icons/ri";

export default function ChatBot() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const reply = await sendGeminiMessage(input);
    const botMessage = { role: "bot", text: reply };
    setMessages((prev) => [...prev, botMessage]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4 my-8 max-w-[650px] mx-auto space-y-4 bg-gray-50 rounded-xl shadow-md">
      
      <h2 className="flex  justify-center text-2xl font-semibold text-center text-blue-600"><RiRobot2Line className="mx-3 my-1"/>  ReFrame Chat</h2>
      {/* Chat messages box */}
      <div className="h-96 overflow-y-auto px-2 py-4 bg-white rounded-lg border space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`prose prose-sm px-4 py-3 rounded-xl max-w-[90%] overflow-x-auto whitespace-pre-wrap shadow-sm ${
                m.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <ReactMarkdown>{m.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
