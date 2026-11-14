/**
 * Google Gemini API Client
 * Uses gemini-3.5-flash (with robust retry & model fallback).
 */

const DEFAULT_API_KEY = "AQ.Ab8RN6LyFNqrlxRnNuo5Ke7abL3fh35Vnwi2-zlINimD1CflTA";

export function getApiKey(): string {
  return process.env.GEMINI_API_KEY || DEFAULT_API_KEY;
}

const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-flash-latest"];

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callGemini(
  prompt: string,
  systemInstruction?: string,
  temperature: number = 0.4,
  isJson: boolean = false
): Promise<string> {
  const apiKey = getApiKey();
  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];

  let lastError: any = null;

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const generationConfig: any = {
          temperature,
          maxOutputTokens: 8192,
        };

        if (isJson) {
          generationConfig.responseMimeType = "application/json";
        }

        const body: any = {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig,
        };

        if (systemInstruction) {
          body.systemInstruction = {
            parts: [{ text: systemInstruction }],
          };
        }

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (res.status === 429) {
          const waitTime = attempt * 2000;
          console.warn(`[Gemini ${model}] 429 Rate limited, retrying in ${waitTime}ms... (attempt ${attempt}/3)`);
          await delay(waitTime);
          continue;
        }

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errText}`);
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error("No text candidate returned by Gemini.");
        }

        return text;
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini ${model}] Attempt ${attempt} failed:`, err.message);
        if (attempt < 3) {
          await delay(attempt * 1500);
        }
      }
    }
    console.warn(`[Gemini] Switching from ${model} to next model in fallback list...`);
  }

  throw new Error(`Gemini API failed after multiple retries: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Strips comments and trailing commas from dirty JSON strings
 */
function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  // Strip code blocks
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  }

  // Remove single-line comments // ...
  cleaned = cleaned.replace(/\/\/.*$/gm, "");

  // Remove multi-line comments /* ... */
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove trailing commas before } or ]
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  return cleaned;
}

/**
 * Call Gemini expecting a clean JSON response
 */
export async function callGeminiJson<T>(
  prompt: string,
  systemInstruction?: string
): Promise<T> {
  const jsonPrompt = `${prompt}

IMPORTANT: Return valid, pure JSON without any comments, trailing commas, or markdown formatting.`;

  const rawText = await callGemini(jsonPrompt, systemInstruction, 0.2, true);
  const cleaned = cleanJsonString(rawText);

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(cleanJsonString(match[0])) as T;
      } catch (innerErr) {
        // Fallback
      }
    }
    throw new Error(`Failed to parse JSON response from Gemini. Raw was:\n${cleaned.substring(0, 300)}...`);
  }
}
