// src/api/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const sendGeminiMessage = async (message: string) => {
  try {
    const chat = await model.startChat({ history: [] });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error("Gemini chat error:", error);
    return "Oops! Something went wrong.";
  }
};
