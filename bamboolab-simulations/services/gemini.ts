import { GoogleGenAI } from "@google/genai";
import { SimContextData } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTutorResponse = async (
  history: { role: string; text: string }[],
  simContext: SimContextData
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const contextPrompt = `
      You are an intelligent and helpful science tutor built into an interactive simulation app called BambooLab.
      
      Current Simulation Context:
      - Simulation: ${simContext.name}
      - Description: ${simContext.description}
      - Current Parameters: ${JSON.stringify(simContext.parameters, null, 2)}
      
      Goal: Answer the user's question. If they ask about specific physics/math behavior, reference the current parameters (like gravity, velocity, length, etc.) to explain why the simulation is behaving that way. Keep answers concise (under 150 words) but educational. Encouraging users to experiment with the sliders.
    `;

    const contents = [
      { role: 'user', parts: [{ text: contextPrompt }] }, // System priming as first user message context
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    ];

    // Using the correct generateContent API
    const response = await ai.models.generateContent({
      model,
      contents: contents.map(c => ({ role: c.role, parts: c.parts })),
    });

    return response.text || "I'm having trouble analyzing the simulation right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error while thinking. Please check your internet connection or API key.";
  }
};