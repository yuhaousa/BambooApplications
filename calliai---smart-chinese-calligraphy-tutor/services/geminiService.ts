import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, Language } from '../types';

// Initialize client
const apiKey = process.env.API_KEY;
if (!apiKey || apiKey.includes('PLACEHOLDER')) {
  console.error("Gemini API Key is missing or invalid. Please check your .env.local file.");
}
const ai = new GoogleGenAI({ apiKey: apiKey });

export const evaluateHandwriting = async (character: string, imageDataUrl: string, language: Language = 'en'): Promise<AnalysisResponse> => {
  // Strip the data:image/png;base64, prefix
  const base64Data = imageDataUrl.split(',')[1];

  const modelId = 'gemini-2.5-flash';

  const langName = language === 'zh' ? 'Simplified Chinese' : language === 'th' ? 'Thai' : 'English';

  const prompt = `
    I am practicing the Chinese character "${character}".
    I have provided an image of my handwriting where THE STROKES ARE COLOR-CODED IN TIME ORDER.
    
    VISUAL LEGEND:
    1. COLOR: Red (Start) -> Yellow -> Green -> Blue/Purple (End).
    2. DOTS: A solid DOT marks the exact START position of each stroke. Use this to determine DIRECTION.

    YOUR TASK:
    Analyze the character stroke-by-stroke. For every error detected, categorize it and provide a correction.
    
    CRITICAL INSTRUCTION: 
    You MUST provide ALL text output (critique, explanation, correction, positiveFeedback) in the ${langName} language.
    Do NOT output English unless the requested language is English.

    DETECT THESE SPECIFIC ERRORS:
    - ORDER: Is the color gradient correct for standard stroke order? (e.g., Top horizontal before Vertical).
    - DIRECTION: Look at the START DOT. Is the stroke drawn in the wrong direction? (e.g., Drawn Right-to-Left instead of Left-to-Right).
    - CONNECTION: Are strokes connected correctly? (e.g., Should they touch? Did they cross when they shouldn't?).
    - SHAPE: Is the stroke crooked or misshapen?

    Return a JSON response.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER, description: "Overall score 0-10" },
      positiveFeedback: { type: Type.STRING, description: `Brief encouraging comment strictly in ${langName}` },
      critique: { type: Type.STRING, description: `General summary of the handwriting quality strictly in ${langName}` },
      strokeAnalysis: {
        type: Type.ARRAY,
        description: "Detailed analysis of specific strokes, especially if errors exist.",
        items: {
          type: Type.OBJECT,
          properties: {
            strokeIndex: { type: Type.INTEGER, description: "1-based index of the stroke" },
            isCorrect: { type: Type.BOOLEAN },
            errorType: { 
              type: Type.STRING, 
              enum: ['ORDER', 'DIRECTION', 'CONNECTION', 'SHAPE', 'NONE'],
              description: "The primary type of error."
            },
            explanation: { type: Type.STRING, description: `Why it is wrong (e.g., 'You wrote from bottom to top') strictly in ${langName}.` },
            correction: { type: Type.STRING, description: `How to fix it (e.g., 'Write top-down') strictly in ${langName}.` }
          },
          required: ["strokeIndex", "isCorrect", "errorType", "explanation", "correction"]
        }
      }
    },
    required: ["score", "critique", "strokeAnalysis", "positiveFeedback"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: `You are a strict Chinese Calligraphy Tutor. You focus heavily on STROKE ORDER and STROKE DIRECTION. You speak ${langName}. All your responses must be in ${langName}.`
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");

    return JSON.parse(text) as AnalysisResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze handwriting");
  }
};