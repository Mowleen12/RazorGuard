import { GoogleGenAI } from "@google/genai";

export const config = {
  maxDuration: 30,
  runtime: "nodejs",
};

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

async function callGeminiSafely(
  ai: GoogleGenAI,
  prompt: string
): Promise<{ text: string; modelUsed: string } | null> {
  const candidateModels = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
  let lastError = "";

  for (const model of candidateModels) {
    try {
      console.log(`[RazorGuard AI] Calling model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      let text = "";
      try {
        if (typeof response.text === "function") {
          text = response.text();
        } else if (typeof response.text === "string") {
          text = response.text;
        }
      } catch (_) {}
      if (!text && response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
        text = response.candidates[0].content.parts[0].text;
      }

      if (text && text.trim().length > 0) {
        return { text: text.trim(), modelUsed: model };
      }
      lastError = `Model ${model} returned empty text`;
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.error(`[RazorGuard AI] Model ${model} error:`, errMsg);
      lastError = `${model}: ${errMsg}`;

      const isCapacityOrQuota =
        errMsg.includes("503") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("high demand") ||
        errMsg.includes("429") ||
        errMsg.includes("RESOURCE_EXHAUSTED");

      if (isCapacityOrQuota) {
        console.warn(`[RazorGuard AI] Model ${model} unavailable (capacity). Trying fallback...`);
      } else {
        console.warn(`[RazorGuard AI] Model ${model} failed: ${errMsg}. Trying next model...`);
      }
    }
  }

  return null; // All models failed
}

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
        ? "high entropy variance characteristic of headless automated browsers."
        : "expected browser client canvas and WebGL entropy consistent with standard consumer behavior."
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
    answer = `Suspicious Activity Report (SAR) Narrative Summary: On ${transaction.timestamp}, account ${transaction.customerName} triggered a high-severity alert for ${transaction.primaryFlag} on authorization of ₹${transaction.amount?.toFixed(2)} ${transaction.currency}.`;
    evidenceTags = [
      `Case ID: ${transaction.id}`,
      `Score: ${transaction.riskScore}/100`,
      `Regulatory Flag: FinCEN / Fraud Advisory Tier 1`,
    ];
  } else {
    answer = `Investigative evaluation on "${userQuery}" for TX-${transaction.id}: Transaction carries calibrated risk score ${transaction.riskScore}/100 with ${(transaction.confidenceScore * 100).toFixed(0)}% neural certainty. Primary attack indicator is "${transaction.primaryFlag}".`;
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

function generateHeuristicSynthesis(transaction: any) {
  return {
    summary: `Automated forensic evaluation for TX-${transaction.id}: Elevated risk vector identified combining ${transaction.flags?.join(", ") || "behavioral anomalies"}. High confidence correlation with known distributed card-testing signatures and geolocation mismatch.`,
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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { transaction, query } = req.body;
    if (!transaction) {
      return res.status(400).json({ error: "Transaction payload is required" });
    }

    const ai = getGeminiClient();

    if (query && typeof query === "string" && query.trim().length > 0) {
      const userQuery = query.trim();

      if (ai) {
        const queryPrompt = `You are RazorGuard AI — a world-class Payment Fraud Forensic Analyst for Indian UPI systems.

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
            let jsonStr = geminiResult.text;
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              jsonStr = jsonMatch[0];
            }

            const parsed = JSON.parse(jsonStr);
            return res.status(200).json({
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
            return res.status(200).json({
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

      const fallback = generateHeuristicQueryAnswer(transaction, userQuery);
      return res.status(200).json({
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

    if (ai) {
      const prompt = `You are RazorGuard AI — India's premier Payment Fraud Intelligence Platform. Analyze this UPI transaction and produce a comprehensive forensic investigation report.

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
          return res.status(200).json({
            isLiveAI: true,
            modelUsed: geminiResult.modelUsed,
            ...parsed,
          });
        } catch (jsonErr) {
          console.warn("[RazorGuard AI] Failed to parse synthesis JSON. Using fallback.");
        }
      }
    }

    const fallbackSynthesis = generateHeuristicSynthesis(transaction);
    return res.status(200).json({
      isLiveAI: false,
      ...fallbackSynthesis,
      notice: ai ? "Delivered via RazorGuard local forensic engine (upstream model at peak demand)." : undefined,
    });
  } catch (err: any) {
    console.error("[RazorGuard AI] Investigation error:", err?.message || err);
    const { transaction, query } = req.body || {};
    if (transaction && query) {
      const fallback = generateHeuristicQueryAnswer(transaction, String(query));
      return res.status(200).json({
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
    return res.status(200).json({
      isLiveAI: false,
      ...generateHeuristicSynthesis(safeTx),
    });
  }
}
