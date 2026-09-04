export const config = {
  maxDuration: 10,
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.length > 10);

  return res.status(200).json({
    status: "ok",
    platform: "RazorGuard AI Payment Risk Intelligence",
    geminiEnabled: isConfigured,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + "..." : "not set",
  });
}
