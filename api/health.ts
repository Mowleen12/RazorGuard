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
        model: "gemini-2.0-flash",
        contents: "Say hello in one word",
      });
      testResult = typeof response.text === "string" ? response.text : JSON.stringify(response).substring(0, 200);
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
