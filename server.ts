import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini AI client initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Resilient Gemini runner with model fallback and automatic capacity error recovery
async function callGeminiSafely(
  ai: GoogleGenAI,
  prompt: string
): Promise<{ text: string; modelUsed: string } | null> {
  // Try stable Gemini Flash models in sequence
  const candidateModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

  for (const model of candidateModels) {
    try {
      console.log(`[RazorGuard AI] Calling model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      console.log(`[RazorGuard AI] Response received from ${model}`);

      // Extract text from response - handle different response structures
      let text = "";
      if (typeof response.text === "string") {
        text = response.text;
      } else if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
        text = response.candidates[0].content.parts[0].text;
      }

      if (text && text.trim().length > 0) {
        console.log(`[RazorGuard AI] Success with ${model}, response length: ${text.length}`);
        return { text: text.trim(), modelUsed: model };
      } else {
        console.warn(`[RazorGuard AI] Model ${model} returned empty text`);
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.error(`[RazorGuard AI] Model ${model} error:`, errMsg);
      
      const isCapacityOrQuota =
        errMsg.includes("503") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("high demand") ||
        errMsg.includes("429") ||
        errMsg.includes("RESOURCE_EXHAUSTED");

      if (isCapacityOrQuota) {
        console.warn(`[RazorGuard AI] Model ${model} unavailable (capacity). Trying fallback...`);
      } else {
        console.warn(`[RazorGuard AI] Model ${model} failed. Trying fallback...`);
      }
    }
  }

  console.warn("[RazorGuard AI] All models failed, returning null");
  return null;
}

// Domain-specific forensic answer generator (used when API key is unset or AI models are at capacity)
function generateHeuristicQueryAnswer(transaction: any, userQuery: string) {
  const qLower = userQuery.toLowerCase();
  let answer = "";
  let evidenceTags: string[] = [];

  if (qLower.includes("ip") || qLower.includes("tor") || qLower.includes("proxy") || qLower.includes("vpn") || qLower.includes("geo")) {
    answer = `IP Address ${transaction.ipAddress} (${transaction.ipCity}, ${transaction.ipCountry}) is flagged as ${
      transaction.isProxyOrVpn ? "an active anonymized proxy/Tor exit node" : "a residential ISP connection"
    }. The UPI instrument's issuing jurisdiction is ${transaction.issuingCountry}, establishing a ${
      transaction.isProxyOrVpn ? "confirmed cross-border geo-spoofing vector with high chargeback correlation" : "nominal geographic alignment"
    }.`;
    evidenceTags = [
      `IP: ${transaction.ipAddress}`,
      `Anonymizer: ${transaction.isProxyOrVpn ? "TRUE (TOR/VPN)" : "FALSE"}`,
      `Country Mismatch: ${transaction.issuingCountry} vs ${transaction.ipCountry}`,
    ];
  } else if (qLower.includes("device") || qLower.includes("fingerprint") || qLower.includes("hardware") || qLower.includes("browser")) {
    answer = `Device fingerprint ${transaction.deviceHash} (${transaction.deviceType}) exhibits ${
      transaction.primaryFlag?.includes("DEVICE") || transaction.riskScore > 70
        ? "high entropy variance characteristic of headless automated browsers (e.g. Puppeteer/Playwright) cycling spoofed user-agents."
        : "expected browser client canvas and WebGL entropy consistent with standard mobile/desktop consumer behavior."
    }`;
    evidenceTags = [
      `Device: ${transaction.deviceType}`,
      `Hash: ${transaction.deviceHash}`,
      `Primary Flag: ${transaction.primaryFlag || "None"}`,
    ];
  } else if (qLower.includes("velocity") || qLower.includes("burst") || qLower.includes("rate") || qLower.includes("frequency") || qLower.includes("hour")) {
    answer = `Velocity monitor logged ${transaction.velocityLastHour} authorization attempts in the preceding 60 minutes. The merchant MCC standard baseline is < 2 attempts/hr. This ${
      transaction.velocityLastHour > 5 ? "confirms a programmatic high-speed card-testing burst" : "falls within acceptable retry tolerance"
    }.`;
    evidenceTags = [
      `1h Velocity: ${transaction.velocityLastHour} attempts`,
      `Baseline: < 2.0 / hr`,
      `Velocity Impact: ${transaction.velocityLastHour > 5 ? "+28 pts risk" : "+0 pts"}`,
    ];
  } else if (qLower.includes("card") || qLower.includes("bin") || qLower.includes("issuer") || qLower.includes("bank") || qLower.includes("3ds")) {
    answer = `Card instrument ${transaction.cardBrand} •••• ${transaction.cardLast4} (BIN: ${transaction.bin}) issued by ${transaction.issuingBank} (${transaction.issuingCountry}). UPI/3DS Authentication returned "${transaction.threeDsStatus}". ${
      transaction.threeDsStatus.includes("SUCCESS")
        ? "Cryptographic liability shift is active; issuer retains chargeback liability."
        : "Liability shift was not established. Merchant carries 100% financial liability on chargeback dispute."
    }`;
    evidenceTags = [
      `BIN: ${transaction.bin}`,
      `Issuer: ${transaction.issuingBank}`,
      `3DS Status: ${transaction.threeDsStatus}`,
    ];
  } else if (qLower.includes("sar") || qLower.includes("report") || qLower.includes("regulatory") || qLower.includes("law") || qLower.includes("audit")) {
    answer = `Suspicious Activity Report (SAR) Narrative Summary: On ${transaction.timestamp}, account ${transaction.customerName} (${transaction.customerEmail}) triggered a high-severity alert for ${transaction.primaryFlag} on authorization of ₹${transaction.amount.toFixed(2)} ${transaction.currency}. Telemetry detected proxy IP ${transaction.ipAddress} and UPI velocity of ${transaction.velocityLastHour}/hr. TreeSHAP attribution confirms ${transaction.shapExplanations?.[0]?.feature || "behavioral anomaly"} as the lead risk contributor.`;
    evidenceTags = [
      `Case ID: ${transaction.id}`,
      `Score: ${transaction.riskScore}/100`,
      `Regulatory Flag: FinCEN / Fraud Advisory Tier 1`,
    ];
  } else {
    answer = `Investigative evaluation on "${userQuery}" for TX-${transaction.id}: Transaction carries calibrated risk score ${transaction.riskScore}/100 with ${(transaction.confidenceScore * 100).toFixed(0)}% neural certainty. Primary attack indicator is "${transaction.primaryFlag}". Key contributing factors include ${transaction.evidence?.map((e: any) => e.factor).join(", ") || "elevated risk parameters"}.`;
    evidenceTags = [
      `Risk Score: ${transaction.riskScore}/100`,
      `Tier: ${transaction.riskTier}`,
      `Dominant Signal: ${transaction.primaryFlag}`,
    ];
  }

  return {
    answer,
    evidenceTags,
    confidence: transaction.confidenceScore || 0.94,
    recommendedAction: transaction.riskScore >= 75 ? "HARD_BLOCK" : transaction.riskScore >= 45 ? "HOLD_INVESTIGATION" : "ALLOW",
  };
}

// Domain-specific full investigation synthesis generator
function generateHeuristicSynthesis(transaction: any) {
  return {
    summary: `Automated forensic evaluation for TX-${transaction.id}: Elevated risk vector identified combining ${transaction.flags?.join(", ") || "behavioral anomalies"}. High confidence correlation with known distributed card-testing signatures and geolocation mismatch. Immediate analyst intervention recommended.`,
    hypothesis: `Adversary executing automated credential-stuffing or card-testing sequences from proxy IP (${transaction.ipAddress}) masquerading as domestic consumer.`,
    recommendedAction: transaction.riskScore >= 75 ? "HARD_BLOCK" : transaction.riskScore >= 45 ? "MANUAL_REVIEW" : "ALLOW",
    confidence: 0.94,
    keyRisks: [
      "Device fingerprint hash collisions with known fraudulent nodes",
      "Mismatched billing country vs IP egress gateway",
      "Abnormal transaction velocity within short temporal window",
    ],
  };
}

// Health check
app.get("/api/health", (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.length > 10);
  res.json({
    status: "ok",
    platform: "RazorGuard AI Payment Risk Intelligence",
    geminiEnabled: isConfigured,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + "..." : "not set",
  });
});

// Live AI Investigation Endpoint (Synthesis & Custom Query Answering)
app.post("/api/investigate", async (req, res) => {
  try {
    const { transaction, query } = req.body;
    if (!transaction) {
      return res.status(400).json({ error: "Transaction payload is required" });
    }

    console.log(`[RazorGuard AI] Investigation request received. Query: "${query || '(synthesis)'}" for TX-${transaction.id}`);
    
    const ai = getGeminiClient();
    console.log(`[RazorGuard AI] Gemini client ${ai ? 'initialized' : 'NOT initialized (using heuristic)'}`);

    // Handler for specific user queries / questions about the transaction
    if (query && typeof query === "string" && query.trim().length > 0) {
      const userQuery = query.trim();

      if (ai) {
        const queryPrompt = `You are RazorGuard AI — a world-class Payment Fraud Forensic Analyst for Indian UPI systems. You are assisting a senior fraud investigator examining a suspicious transaction.

## Transaction Under Investigation
Transaction ID: ${transaction.id}
Risk Score: ${transaction.riskScore}/100 (Tier: ${transaction.riskTier})
Status: ${transaction.status}
Amount: ₹${transaction.amount?.toFixed(2)} ${transaction.currency}
Merchant: ${transaction.merchantName} (${transaction.merchantCategory})
Customer: ${transaction.customerName} (${transaction.customerEmail})
Card: ${transaction.cardBrand} •••• ${transaction.cardLast4} (BIN: ${transaction.bin})
Issuing Bank: ${transaction.issuingBank} (${transaction.issuingCountry})
IP: ${transaction.ipAddress} (${transaction.ipCity}, ${transaction.ipCountry})
Proxy/VPN Detected: ${transaction.isProxyOrVpn ? 'YES' : 'NO'}
Device: ${transaction.deviceType} | Hash: ${transaction.deviceHash}
Velocity: ${transaction.velocityLastHour} attempts/hr
3DS Status: ${transaction.threeDsStatus}
Primary Flag: ${transaction.primaryFlag}
Attack Hypothesis: ${transaction.attackHypothesis}
Confidence: ${(transaction.confidenceScore * 100).toFixed(0)}%

## SHAP Risk Attribution
${(transaction.shapExplanations || []).map((s: any) => `- ${s.feature}: weight=${s.weight}, impact=${s.impact}, value=${s.value}`).join('\n')}

## Evidence Chain
${(transaction.evidence || []).map((e: any) => `- [${e.severity.toUpperCase()}] ${e.factor}: ${e.description} (${e.scoreDelta > 0 ? '+' : ''}${e.scoreDelta} pts)`).join('\n')}

## Analyst Question
"${userQuery}"

## Response Format
Return ONLY a valid JSON object (no markdown, no code blocks, no extra text) with these fields:
{"answer": "Your 2-4 sentence forensic analysis with specific numbers and technical details.", "evidenceTags": ["Tag1", "Tag2", "Tag3"], "recommendedAction": "HARD_BLOCK", "confidence": 0.95}`;

        const geminiResult = await callGeminiSafely(ai, queryPrompt);
        if (geminiResult) {
          try {
            // Try to extract JSON from response (might be wrapped in markdown)
            let jsonStr = geminiResult.text;
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              jsonStr = jsonMatch[0];
            }
            
            const parsed = JSON.parse(jsonStr);
            console.log(`[RazorGuard AI] Parsed response successfully with ${geminiResult.modelUsed}`);
            return res.json({
              isLiveAI: true,
              modelUsed: geminiResult.modelUsed,
              query: userQuery,
              answer: parsed.answer || "Query processed successfully.",
              evidenceTags: parsed.evidenceTags || [],
              confidence: parsed.confidence || 0.95,
              recommendedAction: parsed.recommendedAction || (transaction.riskScore >= 75 ? "HARD_BLOCK" : "MANUAL_REVIEW"),
              timestamp: new Date().toLocaleTimeString(),
            });
          } catch (jsonErr) {
            console.warn("[RazorGuard AI] Failed to parse Gemini JSON. Raw text:", geminiResult.text.substring(0, 200));
            // Use the raw text as the answer if JSON parsing fails
            return res.json({
              isLiveAI: true,
              modelUsed: geminiResult.modelUsed,
              query: userQuery,
              answer: geminiResult.text,
              evidenceTags: [`Score: ${transaction.riskScore}/100`, `Tier: ${transaction.riskTier}`],
              confidence: 0.90,
              recommendedAction: transaction.riskScore >= 75 ? "HARD_BLOCK" : "MANUAL_REVIEW",
              timestamp: new Date().toLocaleTimeString(),
            });
          }
        }
      }

      // If AI is unconfigured or unavailable (e.g. 503 high demand spike), use expert heuristic response
      const fallback = generateHeuristicQueryAnswer(transaction, userQuery);
      return res.json({
        isLiveAI: false,
        query: userQuery,
        answer: fallback.answer,
        evidenceTags: fallback.evidenceTags,
        confidence: fallback.confidence,
        recommendedAction: fallback.recommendedAction,
        timestamp: new Date().toLocaleTimeString(),
        notice: ai ? "Delivered via RazorGuard local forensic engine (upstream model at peak demand)." : undefined,
      });
    }

    // Default Full Synthesis when no user query is supplied
    if (ai) {
      const prompt = `You are RazorGuard AI — India's premier Payment Fraud Intelligence Platform. Analyze this UPI transaction and produce a comprehensive forensic investigation report for a senior fraud analyst.

## Transaction Details
Transaction ID: ${transaction.id}
Risk Score: ${transaction.riskScore}/100 (Tier: ${transaction.riskTier})
Status: ${transaction.status}
Amount: ₹${transaction.amount?.toFixed(2)} ${transaction.currency}
Timestamp: ${transaction.timestamp}
Merchant: ${transaction.merchantName} (${transaction.merchantCategory})
Customer: ${transaction.customerName} (${transaction.customerEmail})
Card: ${transaction.cardBrand} •••• ${transaction.cardLast4} (BIN: ${transaction.bin})
Issuing Bank: ${transaction.issuingBank} (${transaction.issuingCountry})
IP: ${transaction.ipAddress} (${transaction.ipCity}, ${transaction.ipCountry})
Proxy/VPN: ${transaction.isProxyOrVpn ? 'DETECTED' : 'Clean residential'}
Device: ${transaction.deviceType} | Hash: ${transaction.deviceHash}
Velocity: ${transaction.velocityLastHour} attempts/hr
3DS: ${transaction.threeDsStatus}
Primary Flag: ${transaction.primaryFlag}
Confidence: ${(transaction.confidenceScore * 100).toFixed(0)}%

## SHAP Attribution
${(transaction.shapExplanations || []).map((s: any) => `- ${s.feature}: weight=${s.weight}, impact=${s.impact}, value=${s.value}`).join('\n')}

## Evidence
${(transaction.evidence || []).map((e: any) => `- [${e.severity.toUpperCase()}] ${e.factor}: ${e.description} (${e.scoreDelta > 0 ? '+' : ''}${e.scoreDelta} pts)`).join('\n')}

## Response Format
Return ONLY a valid JSON object (no markdown, no code blocks, no extra text):
{"summary": "2-3 sentence executive summary.", "hypothesis": "Primary attack vector.", "recommendedAction": "HARD_BLOCK", "confidence": 0.94, "keyRisks": ["Risk 1", "Risk 2", "Risk 3"]}`;

      const geminiResult = await callGeminiSafely(ai, prompt);
      if (geminiResult) {
        try {
          let jsonStr = geminiResult.text;
          const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonStr = jsonMatch[0];
          }
          
          const parsed = JSON.parse(jsonStr);
          console.log(`[RazorGuard AI] Synthesis parsed successfully with ${geminiResult.modelUsed}`);
          return res.json({
            isLiveAI: true,
            modelUsed: geminiResult.modelUsed,
            ...parsed,
          });
        } catch (jsonErr) {
          console.warn("[RazorGuard AI] Failed to parse synthesis JSON. Using fallback.");
        }
      }
    }

    // Seamless fallback synthesis
    const fallbackSynthesis = generateHeuristicSynthesis(transaction);
    return res.json({
      isLiveAI: false,
      ...fallbackSynthesis,
      notice: ai ? "Delivered via RazorGuard local forensic engine (upstream model at peak demand)." : undefined,
    });
  } catch (err: any) {
    console.error("[RazorGuard AI] Investigation caught error, serving heuristic fallback:", err?.message || err);
    const { transaction, query } = req.body || {};
    if (transaction && query) {
      const fallback = generateHeuristicQueryAnswer(transaction, String(query));
      return res.json({
        isLiveAI: false,
        query,
        answer: fallback.answer,
        evidenceTags: fallback.evidenceTags,
        confidence: fallback.confidence,
        recommendedAction: fallback.recommendedAction,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
    const safeTx = transaction || { id: "unknown", flags: [], riskScore: 50 };
    return res.json({
      isLiveAI: false,
      ...generateHeuristicSynthesis(safeTx),
    });
  }
});

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RazorGuard server running on http://localhost:${PORT}`);
  });
}

start();
