import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize safe client, handle missing key gracefully in UI
const ai = new GoogleGenAI({ apiKey });

// 1. ChatGuru: Uses gemini-3-pro-preview with thinking for complex advice
// or gemini-3-flash-preview with search for research.
export const getChatGuruResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  lastMessage: string,
  mode: 'advice' | 'research'
) => {
  if (!apiKey) throw new Error("API Key is missing");

  try {
    if (mode === 'advice') {
      // "Think more when needed" - Thinking budget enabled
      const model = 'gemini-3-pro-preview';
      const response = await ai.models.generateContent({
        model,
        contents: [
          ...history.map(h => ({ role: h.role, parts: h.parts })),
          { role: 'user', parts: [{ text: lastMessage }] }
        ],
        config: {
            thinkingConfig: { thinkingBudget: 1024 }, // Set moderate budget for demo latency
            systemInstruction: "You are 'ChatGuru', a wise and empathetic academic career advisor for RUET students. You have access to the internal Knowledge Base (Academic Ordinance, Course Syllabus, and Career Paths). Provide detailed, actionable advice based on university policies and industry standards.",
        }
      });
      return {
        text: response.text || "I'm thinking...",
        sources: []
      };
    } else {
      // "Use Google Search data"
      const model = 'gemini-3-flash-preview';
      const response = await ai.models.generateContent({
        model,
        contents: [
            ...history.map(h => ({ role: h.role, parts: h.parts })),
            { role: 'user', parts: [{ text: lastMessage }] }
        ],
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are a helpful assistant for finding latest career news and facts.",
        }
      });
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .map((chunk: any) => chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : null)
        .filter((s: any) => s !== null);

      return {
        text: response.text || "Here is what I found.",
        sources
      };
    }
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return { text: "Sorry, I encountered an error connecting to the AI service.", sources: [] };
  }
};

// 2. Resume Parser: Uses gemini-2.5-flash for document understanding
export const parseResumeWithAI = async (base64Data: string, mimeType: string) => {
  if (!apiKey) throw new Error("API Key is missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: "Extract the following from the resume: 1. Skills (list of strings), 2. Experience Summary (one paragraph), 3. Education History (list of strings formatted as 'Degree - Institution (Year)'). Return JSON."
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            experience: { type: Type.STRING },
            education: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Resume Parsing Error:", error);
    throw error;
  }
};

// 3. Fast Job Match: Uses gemini-2.5-flash-lite for low latency response
export const getJobMatchScore = async (studentProfile: string, jobDescription: string) => {
  if (!apiKey) return 0;

  try {
    const prompt = `
      Student Profile: ${studentProfile}
      Job Description: ${jobDescription}
      
      Rate the match suitability from 0 to 100. Return only the number.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest', // Fast model
      contents: prompt,
    });
    
    const score = parseInt(response.text?.trim() || '0');
    return isNaN(score) ? 0 : score;
  } catch (error) {
    console.error("Match Score Error:", error);
    return 0;
  }
};