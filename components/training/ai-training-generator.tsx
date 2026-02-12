"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, CheckCircle } from "lucide-react";

interface AiTrainingGeneratorProps {
  locale: string;
  dictionary: {
    ai: Record<string, string>;
    plans: Record<string, unknown>;
  };
  onApply?: (plan: GeneratedPlan) => void;
}

interface GeneratedExercise {
  name: string;
  description: string;
  duration: number;
  equipment: string;
  orderIndex: number;
}

interface GeneratedPlan {
  title: string;
  description: string;
  duration: number;
  focusArea: string;
  difficulty: string;
  exercises: GeneratedExercise[];
}

export function AiTrainingGenerator({
  locale,
  dictionary,
  onApply,
}: AiTrainingGeneratorProps) {
  const [ageGroup, setAgeGroup] = useState("10-14");
  const [level, setLevel] = useState("INTERMEDIATE");
  const [focus, setFocus] = useState("tactics");
  const [playerCount, setPlayerCount] = useState("16");
  const [duration, setDuration] = useState("90");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPlan(null);

    try {
      const response = await fetch("/api/ai/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ageGroup, level, focus, playerCount, duration: parseInt(duration), locale }),
      });

      if (!response.ok) {
        throw new Error("AI plan oluşturulamadı");
      }

      const plan = await response.json();
      setGeneratedPlan(plan);
    } catch {
      setError(dictionary.ai.error || "AI could not generate a response");
    } finally {
      setIsLoading(false);
    }
  };

  const focusAreas = dictionary.plans.focusAreas as Record<string, string>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          {dictionary.ai.generatePlan}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>{dictionary.ai.ageGroup}</Label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6-8">6-8</SelectItem>
                <SelectItem value="8-10">8-10</SelectItem>
                <SelectItem value="10-12">10-12</SelectItem>
                <SelectItem value="12-14">12-14</SelectItem>
                <SelectItem value="14-16">14-16</SelectItem>
                <SelectItem value="16-18">16-18</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{dictionary.ai.level}</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">
                  {(dictionary.plans.difficulties as Record<string, string>)?.BEGINNER || "Beginner"}
                </SelectItem>
                <SelectItem value="INTERMEDIATE">
                  {(dictionary.plans.difficulties as Record<string, string>)?.INTERMEDIATE || "Intermediate"}
                </SelectItem>
                <SelectItem value="ADVANCED">
                  {(dictionary.plans.difficulties as Record<string, string>)?.ADVANCED || "Advanced"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{dictionary.ai.focus}</Label>
            <Select value={focus} onValueChange={setFocus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {focusAreas &&
                  Object.entries(focusAreas).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{dictionary.ai.playerCount}</Label>
            <Input
              type="number"
              value={playerCount}
              onChange={(e) => setPlayerCount(e.target.value)}
              min="6"
              max="30"
            />
          </div>

          <div className="space-y-2">
            <Label>{dictionary.ai.durationLabel}</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="30"
              max="180"
            />
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {dictionary.ai.generating}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {dictionary.ai.generate}
            </>
          )}
        </Button>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {generatedPlan && (
          <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{generatedPlan.title}</h4>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">{generatedPlan.description}</p>

            <div className="space-y-2">
              {generatedPlan.exercises.map((ex, idx) => (
                <div key={idx} className="rounded-md border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {idx + 1}. {ex.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{ex.duration} min</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{ex.description}</p>
                  {ex.equipment && (
                    <p className="mt-1 text-xs text-muted-foreground italic">
                      {(dictionary.plans as Record<string, string>).equipment || "Equipment"}: {ex.equipment}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {onApply && (
              <Button onClick={() => onApply(generatedPlan)} className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" />
                {dictionary.ai.applyPlan}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
