import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

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
    const { ageGroup, level, focus, playerCount, duration, locale = "tr" } = body;

    const languageMap: Record<string, string> = {
      tr: "Turkish",
      en: "English",
      es: "Spanish",
    };
    const language = languageMap[locale] || "Turkish";

    const prompt = `You are a professional football/soccer training plan generator. Create a detailed training plan in ${language}.

Parameters:
- Age group: ${ageGroup || "10-14"} years old
- Skill level: ${level || "Intermediate"}
- Focus area: ${focus || "General"}
- Number of players: ${playerCount || "16"}
- Total duration: ${duration || "90"} minutes

Generate a training plan in this exact JSON format:
{
  "title": "Training plan title",
  "description": "Brief description of the training plan",
  "duration": ${duration || 90},
  "focusArea": "${focus || "tactics"}",
  "difficulty": "${level === "Beginner" || level === "BEGINNER" ? "BEGINNER" : level === "Advanced" || level === "ADVANCED" ? "ADVANCED" : "INTERMEDIATE"}",
  "exercises": [
    {
      "name": "Exercise name",
      "description": "Detailed description of the exercise, including setup and rules",
      "duration": 15,
      "equipment": "cones, balls",
      "orderIndex": 0
    }
  ]
}

Rules:
- Include 5-8 exercises that fill the total duration
- Start with warm-up, end with cool-down
- Each exercise should have clear description
- Equipment should be realistic (cones, balls, bibs, goals, ladders, etc.)
- Make the plan progressive in intensity
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

    let jsonText = textContent.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    }
    const plan = JSON.parse(jsonText);
    return NextResponse.json(plan);
  } catch (error) {
    console.error("AI training generation error:", error);
    return NextResponse.json(
      { message: "AI plan olusturulamadi" },
      { status: 500 }
    );
  }
}
