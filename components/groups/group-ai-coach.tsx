"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Target, Users, Shield, Calendar } from "lucide-react";

interface GroupAiCoachProps {
  groupId: string;
  locale: string;
  dictionary: {
    aiCoach: Record<string, string>;
  };
}

interface GroupAnalysis {
  strengths: string[];
  weaknesses: string[];
  averageAge: number;
  attendanceRate: number;
}

interface RecommendedExercise {
  name: string;
  description: string;
  duration: number;
  targetSkill: string;
  reason: string;
}

interface PlayerTactic {
  studentName: string;
  suggestedPosition: string;
  reasoning: string;
  developmentFocus: string;
}

interface FormationSuggestion {
  formation: string;
  description: string;
}

interface WeeklyFocusPlan {
  day1: string;
  day2: string;
  day3: string;
}

interface CoachResult {
  groupAnalysis: GroupAnalysis;
  recommendedExercises: RecommendedExercise[];
  playerTactics: PlayerTactic[];
  formationSuggestion: FormationSuggestion;
  weeklyFocusPlan: WeeklyFocusPlan;
}

export function GroupAiCoach({ groupId, locale, dictionary }: GroupAiCoachProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CoachResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = dictionary.aiCoach;

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/ai/group-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, locale }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.message === "No students in group") {
          setError(t.noData);
        } else {
          throw new Error(data.message);
        }
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(msg || t.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.analyzing}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {t.analyze}
            </>
          )}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {result && (
          <div className="space-y-6">
            {/* Group Analysis */}
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                {t.title}
              </h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                    {t.strengths}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {result.groupAnalysis.strengths.map((s, i) => (
                      <Badge key={i} variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                    {t.weaknesses}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {result.groupAnalysis.weaknesses.map((w, i) => (
                      <Badge key={i} variant="outline" className="border-red-500 text-red-700 dark:text-red-400">
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Exercises */}
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                {t.recommendedExercises}
              </h4>
              <div className="space-y-2">
                {result.recommendedExercises.map((ex, idx) => (
                  <div key={idx} className="rounded-md border bg-card p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {idx + 1}. {ex.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {ex.duration} min
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{ex.description}</p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {t.targetSkill}: {ex.targetSkill}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs italic text-muted-foreground">
                      {t.reason}: {ex.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Player Tactics */}
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t.playerTactics}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium">{t.studentName || "Ad"}</th>
                      <th className="text-left py-2 pr-4 font-medium">{t.suggestedPosition}</th>
                      <th className="text-left py-2 pr-4 font-medium">{t.reason}</th>
                      <th className="text-left py-2 font-medium">{t.developmentFocus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.playerTactics.map((pt, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium">{pt.studentName}</td>
                        <td className="py-2 pr-4">
                          <Badge variant="outline">{pt.suggestedPosition}</Badge>
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">{pt.reasoning}</td>
                        <td className="py-2 text-muted-foreground">{pt.developmentFocus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Formation Suggestion */}
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t.formationSuggestion}
              </h4>
              <div className="flex items-center gap-3">
                <Badge className="text-lg px-3 py-1">{result.formationSuggestion.formation}</Badge>
                <p className="text-sm text-muted-foreground">{result.formationSuggestion.description}</p>
              </div>
            </div>

            {/* Weekly Focus Plan */}
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t.weeklyFocus}
              </h4>
              <div className="space-y-2">
                {Object.entries(result.weeklyFocusPlan).map(([day, focus], idx) => (
                  <div key={day} className="flex gap-3 rounded-md border bg-card p-3">
                    <Badge variant="secondary" className="shrink-0">
                      {t.day || "Gun"} {idx + 1}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
