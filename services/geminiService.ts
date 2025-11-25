import { GoogleGenAI } from "@google/genai";
import { CryptoAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean and extract JSON
const extractJson = (text: string): any => {
  let jsonString = text.trim();

  // 1. Try to find markdown code block
  const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    jsonString = markdownMatch[1].trim();
  }

  // 2. Find first { and last } to strip conversational text
  // We do this even after markdown extraction in case there's whitespace or garbage inside the block
  const firstOpen = jsonString.indexOf('{');
  const lastClose = jsonString.lastIndexOf('}');
  
  if (firstOpen !== -1 && lastClose !== -1) {
    jsonString = jsonString.substring(firstOpen, lastClose + 1);
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON Parse Error:", error);
    console.log("Raw AI Text:", text);
    throw new Error("Failed to parse the AI's analysis. The response was not in a valid JSON format. Please try again.");
  }
};

export const analyzeCrypto = async (coinName: string): Promise<CryptoAnalysis> => {
  const model = "gemini-2.5-flash"; // Supports Search Grounding well
  
  const prompt = `
    Act as a senior professional crypto trader and financial analyst with 20 years of experience.
    Your task is to analyze the cryptocurrency "${coinName}".
    
    1. Use Google Search to find the latest real-time price, recent news, market sentiment, and any major upcoming events (forks, regulation, tech upgrades).
    2. Perform a deep technical analysis (patterns like Head & Shoulders, wedges, RSI, MACD, Elliott Wave) and fundamental analysis (tokenomics, team, utility).
    3. Consider macro-economic factors (inflation, interest rates, political climate).
    4. Predict the price trend for the next 3-4 months.
    5. Determine the optimal trading setup (Entry, Take Profit, Stop Loss).
    
    CRITICAL OUTPUT RULES (TO PREVENT JSON ERRORS):
    - Return ONLY a valid JSON object.
    - Do NOT include any markdown formatting (like \`\`\`json) or conversational text.
    - **IMPORTANT**: Inside any string values (especially "detailedAnalysis" and "summary"), YOU MUST USE **SINGLE QUOTES (')** for any quotes or emphasis.
    - **NEVER** use double quotes (") inside a string value, as this breaks the JSON structure.
    - Use literal \\n for newlines inside strings. Do not use real line breaks inside strings.
    - Ensure all property names are enclosed in double quotes.
    
    JSON Schema:
    {
      "coin": "${coinName}",
      "currentPrice": "string (e.g., '$1.23' or '$65,000')",
      "verdict": "BUY" | "SELL" | "HOLD" | "WAIT",
      "confidenceScore": number (0-100),
      "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "EXTREME",
      "summary": "string (Short executive summary. Use single quotes for text inside.)",
      "detailedAnalysis": "string (Comprehensive analysis in Markdown. Use \\n for line breaks. Use single quotes for text inside.)",
      "keyFactors": ["string", "string", "string"],
      "entryPrice": "string (e.g., '$1.20 - $1.25')",
      "takeProfit": "string (e.g., '$1.50')",
      "stopLoss": "string (e.g., '$1.10')",
      "predictedTrend": [
        { "label": "Current", "price": number (numeric value only) },
        { "label": "Month 1", "price": number },
        { "label": "Month 2", "price": number },
        { "label": "Month 3", "price": number }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = extractJson(text);
    
    // Extract grounding metadata for sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri,
      }));

    return {
      ...data,
      sources: sources,
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};