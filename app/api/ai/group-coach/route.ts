import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { getGroupAiContext } from "@/lib/data/groups";

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
    const { groupId, locale = "tr" } = body;

    if (!groupId) {
      return NextResponse.json({ message: "groupId is required" }, { status: 400 });
    }

    const context = await getGroupAiContext(groupId, session.user.dealerId);
    if (!context) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    if (context.students.length === 0) {
      return NextResponse.json({ message: "No students in group" }, { status: 400 });
    }

    const languageMap: Record<string, string> = {
      tr: "Turkish",
      en: "English",
      es: "Spanish",
    };
    const language = languageMap[locale] || "Turkish";

    const studentsInfo = context.students
      .map((s) => {
        const devInfo = Object.entries(s.development)
          .map(([cat, metrics]) => {
            const avg = metrics.length > 0
              ? Math.round(metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length * 10) / 10
              : 0;
            return `${cat}: avg ${avg}/10 (${metrics.map((m) => `${m.metric}:${m.score}`).join(", ")})`;
          })
          .join("; ");
        return `- ${s.name} | Age: ${s.age} | Gender: ${s.gender} | Attendance: ${s.attendanceRate}% (${s.totalAttendanceRecords} records) | Development: ${devInfo || "No data"}`;
      })
      .join("\n");

    const prompt = `You are an expert football/soccer youth development coach AI. Analyze the following group data and provide detailed coaching recommendations in ${language}.

GROUP INFORMATION:
- Name: ${context.groupName}
- Branch: ${context.branch}
- Facility: ${context.facility}
- Period: ${context.period}
- Capacity: ${context.totalStudents}/${context.maxCapacity || "N/A"}
- Average Age: ${context.averageAge}
- Overall Attendance Rate: ${context.overallAttendanceRate}%
- Schedule: ${context.schedules.map((s) => `Day ${s.dayOfWeek}: ${s.startTime}-${s.endTime}`).join(", ")}
- Trainers: ${context.trainers.map((t) => `${t.name}${t.isPrimary ? " (Primary)" : ""}`).join(", ")}

STUDENTS:
${studentsInfo}

Based on this data, provide a comprehensive analysis in this exact JSON format:
{
  "groupAnalysis": {
    "strengths": ["string array of 3-5 group strengths"],
    "weaknesses": ["string array of 3-5 group weaknesses"],
    "averageAge": ${context.averageAge},
    "attendanceRate": ${context.overallAttendanceRate}
  },
  "recommendedExercises": [
    {
      "name": "exercise name",
      "description": "detailed description",
      "duration": 15,
      "targetSkill": "target skill area",
      "reason": "why this exercise is recommended for this group"
    }
  ],
  "playerTactics": [
    {
      "studentName": "student full name",
      "suggestedPosition": "suggested position",
      "reasoning": "why this position suits the player",
      "developmentFocus": "what the player should focus on improving"
    }
  ],
  "formationSuggestion": {
    "formation": "e.g. 4-3-3",
    "description": "why this formation works for the group"
  },
  "weeklyFocusPlan": {
    "day1": "focus area and activities for training day 1",
    "day2": "focus area and activities for training day 2",
    "day3": "focus area and activities for training day 3"
  }
}

Rules:
- Include 4-6 recommended exercises
- Include tactical suggestions for EVERY student in the group
- Consider age, gender, attendance rate, and development scores when making recommendations
- Formation should be appropriate for the number of players
- Weekly focus plan should align with the group's weaknesses
- Return ONLY valid JSON, no markdown or additional text`;

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4000,
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
    // Strip markdown code blocks if present
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    }
    const result = JSON.parse(jsonText);
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI group coach error:", error);
    return NextResponse.json(
      { message: "AI analiz yapilamadi" },
      { status: 500 }
    );
  }
}
