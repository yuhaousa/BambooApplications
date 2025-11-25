import { GoogleGenAI, Chat } from "@google/genai";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_TEMPLATE = `
You are "LinguaBot", an advanced AI tutor for inlingua Future Academy.
Your goal is to help the user practice a specific language.
- Current Target Language: {LANGUAGE}
- Tone: Encouraging, futuristic, precise, and adaptive.
- Behavior: 
  1. Engage in conversation in the target language.
  2. If the user makes a mistake, gently correct them in English, then continue in the target language.
  3. Keep responses concise (under 50 words) to facilitate rapid practice.
  4. If the user asks about the school, mention inlingua's history since 1972 but emphasize the new AI-driven curriculum.
`;

export const createChatSession = (language: string): Chat => {
  const instruction = SYSTEM_INSTRUCTION_TEMPLATE.replace('{LANGUAGE}', language);
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: instruction,
      temperature: 0.7,
      maxOutputTokens: 150, // Keep it conversational
    },
  });
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I'm processing that data... please try again.";
  } catch (error) {
    console.error("Gemini Interaction Error:", error);
    return "Connection interrupted. Re-establishing neural link...";
  }
};