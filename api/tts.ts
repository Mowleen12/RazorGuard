export const config = {
  maxDuration: 30,
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, lang = "en" } = req.body;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    const cleanText = text.trim().substring(0, 5000);

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

    const ttsRes = await fetch(ttsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!ttsRes.ok) {
      const errText = await ttsRes.text().catch(() => "");
      console.error(`[RazorGuard TTS] Google TTS HTTP ${ttsRes.status}: ${errText.substring(0, 200)}`);
      return res.status(502).json({ error: "TTS service unavailable" });
    }

    const audioBuffer = await ttsRes.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", 'attachment; filename="razorguard-analysis.mp3"');
    res.setHeader("Content-Length", String(audioBuffer.byteLength));
    return res.send(Buffer.from(audioBuffer));
  } catch (err: any) {
    console.error("[RazorGuard TTS] Error:", err?.message || err);
    return res.status(500).json({ error: "TTS generation failed" });
  }
}
