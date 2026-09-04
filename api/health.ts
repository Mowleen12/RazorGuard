export const config = {
  maxDuration: 30,
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.length > 10);

  let testResult = null;
  let testError = null;

  if (isConfigured) {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: "Say hello in one word",
      });
      let txt = "";
      try { if (typeof response.text === "function") { txt = response.text(); } else if (typeof response.text === "string") { txt = response.text; } } catch(_){}
      if (!txt && response.candidates?.[0]?.content?.parts?.[0]?.text) { txt = response.candidates[0].content.parts[0].text; }
      testResult = txt || JSON.stringify(response).substring(0, 200);
    } catch (err: any) {
      testError = err?.message || String(err);
    }
  }

  return res.status(200).json({
    status: "ok",
    geminiEnabled: isConfigured,
    apiKeyLength: apiKey ? apiKey.length : 0,
    testResult,
    testError,
  });
}
