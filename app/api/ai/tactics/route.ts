import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return NextResponse.json({ message: "Yetkilendirme hatasi" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      opponentFormation,
      teamStrengths,
      teamWeaknesses,
      locale = "tr",
    } = body;

    const languageMap: Record<string, string> = {
      tr: "Turkish",
      en: "English",
      es: "Spanish",
    };
    const language = languageMap[locale] || "Turkish";

    const prompt = `You are a professional football/soccer tactical analyst. Suggest a tactical formation and player positions in ${language}.

Context:
- Opponent formation: ${opponentFormation || "4-4-2"}
- Team strengths: ${teamStrengths || "Fast wingers, strong midfield"}
- Team weaknesses: ${teamWeaknesses || "Weak aerial defense"}

Generate a tactical suggestion in this exact JSON format:
{
  "formation": "4-3-3",
  "description": "Brief tactical description and reasoning",
  "players": [
    { "id": 1, "role": "GK", "x": 400, "y": 500, "label": "GK" },
    { "id": 2, "role": "RB", "x": 650, "y": 420, "label": "RB" },
    { "id": 3, "role": "CB", "x": 480, "y": 420, "label": "CB" },
    { "id": 4, "role": "CB", "x": 320, "y": 420, "label": "CB" },
    { "id": 5, "role": "LB", "x": 150, "y": 420, "label": "LB" },
    { "id": 6, "role": "CDM", "x": 400, "y": 320, "label": "CDM" },
    { "id": 7, "role": "CM", "x": 550, "y": 260, "label": "CM" },
    { "id": 8, "role": "CM", "x": 250, "y": 260, "label": "CM" },
    { "id": 9, "role": "RW", "x": 650, "y": 150, "label": "RW" },
    { "id": 10, "role": "ST", "x": 400, "y": 100, "label": "ST" },
    { "id": 11, "role": "LW", "x": 150, "y": 150, "label": "LW" }
  ],
  "keyInstructions": [
    "Instruction 1",
    "Instruction 2",
    "Instruction 3"
  ]
}

Rules:
- The pitch is 800x540 pixels (x: 0-800, y: 0-540, where y=0 is attacking end)
- Always include exactly 11 players
- Position players realistically for the suggested formation
- Give 3-5 key tactical instructions
- Explain why this formation counters the opponent
- Return ONLY valid JSON, no markdown or additional text`;

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json(
        { message: "AI could not generate a response" },
        { status: 500 }
      );
    }

    const tactics = JSON.parse(textContent.text);
    return NextResponse.json(tactics);
  } catch (error) {
    console.error("AI tactics generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { message: `AI taktik olusturulamadi: ${errorMessage}` },
      { status: 500 }
    );
  }
}
