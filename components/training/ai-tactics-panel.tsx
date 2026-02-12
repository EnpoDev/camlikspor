"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, CheckCircle } from "lucide-react";

interface AiTacticsPanelProps {
  locale: string;
  dictionary: {
    ai: Record<string, string>;
    tacticalBoard: Record<string, unknown>;
  };
  onApply?: (suggestion: TacticalSuggestion) => void;
}

interface TacticalSuggestion {
  formation: string;
  description: string;
  players: Array<{
    id: number;
    role: string;
    x: number;
    y: number;
    label: string;
  }>;
  keyInstructions: string[];
}

export function AiTacticsPanel({ locale, dictionary, onApply }: AiTacticsPanelProps) {
  const [opponentFormation, setOpponentFormation] = useState("4-4-2");
  const [teamStrengths, setTeamStrengths] = useState("");
  const [teamWeaknesses, setTeamWeaknesses] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<TacticalSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuggest = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const response = await fetch("/api/ai/tactics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opponentFormation,
          teamStrengths,
          teamWeaknesses,
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error("AI tactic suggestion failed");
      }

      const data = await response.json();
      setSuggestion(data);
    } catch {
      setError(dictionary.ai.error || "AI could not generate a response");
    } finally {
      setIsLoading(false);
    }
  };

  const formations = (dictionary.tacticalBoard.formations || {}) as Record<string, string>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          {dictionary.ai.suggestTactic}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{(dictionary.tacticalBoard as Record<string, string>).formation || "Opponent Formation"}</Label>
          <Select value={opponentFormation} onValueChange={setOpponentFormation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(formations).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Team Strengths</Label>
          <Input
            value={teamStrengths}
            onChange={(e) => setTeamStrengths(e.target.value)}
            placeholder="Fast wingers, strong midfield..."
          />
        </div>

        <div className="space-y-2">
          <Label>Team Weaknesses</Label>
          <Textarea
            value={teamWeaknesses}
            onChange={(e) => setTeamWeaknesses(e.target.value)}
            placeholder="Weak aerial defense..."
            rows={2}
          />
        </div>

        <Button onClick={handleSuggest} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {dictionary.ai.suggesting}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {dictionary.ai.suggestTactic}
            </>
          )}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {suggestion && (
          <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{suggestion.formation}</h4>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">{suggestion.description}</p>

            {suggestion.keyInstructions && (
              <ul className="space-y-1">
                {suggestion.keyInstructions.map((instruction, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="font-bold text-primary">{idx + 1}.</span>
                    {instruction}
                  </li>
                ))}
              </ul>
            )}

            {onApply && (
              <Button onClick={() => onApply(suggestion)} className="w-full" size="sm">
                <CheckCircle className="mr-2 h-4 w-4" />
                {dictionary.ai.applySuggestion}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
