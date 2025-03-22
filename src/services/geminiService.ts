import { ProtocolData, Recommendation } from "../types/defi";

export async function getDefiInsights(userBalance: number) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const prompt = `
      I need DeFi investment recommendations for Aptos blockchain.
      My current APT balance is ${userBalance} APT.
      Please suggest 3 different DeFi protocols on Aptos with their APY rates, 
      risk levels (as a decimal between 0-1), and expected returns.
      Format the response as a JSON array of objects with these fields: 
      name, apy (decimal), riskScore (decimal), address (contract address), 
      description (1-2 sentences about why this is recommended).
    `;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey || "",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    const text = data.candidates[0].content.parts[0].text;

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in Gemini response");
    }

    const protocols = JSON.parse(jsonMatch[0]) as ProtocolData[];

    const recommendations: Recommendation[] = protocols.map((protocol) => ({
      protocol: protocol.name,
      action: "deposit",
      expectedReturn: protocol.apy,
      netBenefit: protocol.apy - protocol.riskScore * 0.02,
      riskLevel: protocol.riskScore,
      address: protocol.address || "0x1",
      description: protocol.description || "",
    }));

    return recommendations;
  } catch (error) {
    console.error("Error getting DeFi insights:", error);
    return generateFallbackRecommendations();
  }
}

function generateFallbackRecommendations(): Recommendation[] {
  return [
    {
      protocol: "Aries Markets",
      action: "deposit",
      expectedReturn: 0.045,
      netBenefit: 0.04,
      riskLevel: 0.2,
      address: "0x12345...",
      description: "Aries Markets offers stable lending returns with lower risk.",
    },
    {
      protocol: "Tsunami Finance",
      action: "deposit",
      expectedReturn: 0.08,
      netBenefit: 0.065,
      riskLevel: 0.4,
      address: "0x23456...",
      description: "Tsunami provides higher yields through optimized lending strategies.",
    },
    {
      protocol: "Ditto Staking",
      action: "deposit",
      expectedReturn: 0.03,
      netBenefit: 0.028,
      riskLevel: 0.1,
      address: "0x34567...",
      description: "Ditto offers the safest staking experience with consistent returns.",
    },
  ];
}
