import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

async function testGemini() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    
    if (!match) {
      console.error("Could not find GEMINI_API_KEY in .env.local");
      return;
    }
    
    const apiKey = match[1].trim();
    console.log("Testing with API Key:", apiKey.substring(0, 5) + "...");

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    console.log("Listing models...");
    const response = await ai.models.list();
    console.log("Available models response:", JSON.stringify(response, null, 2));

    /*
    const modelId = 'gemini-1.5-flash';
    
    console.log(`Sending request to ${modelId}...`);
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { text: "Hello, are you working?" }
        ]
      }
    });

    console.log("Response received:");
    console.log(response.text);
    */
    
  } catch (error) {
    console.error("Error testing Gemini:", error);
  }
}

testGemini();
