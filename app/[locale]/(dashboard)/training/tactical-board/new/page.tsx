"use client";

import { useState, useEffect, useActionState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { TacticalBoardCanvas } from "@/components/training/tactical-board-canvas";
import { AiTacticsPanel } from "@/components/training/ai-tactics-panel";
import {
  createTacticalBoardAction,
  type TrainingFormState,
} from "@/lib/actions/training";
import Link from "next/link";

export default function NewTacticalBoardPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [boardData, setBoardData] = useState("");
  const [formation, setFormation] = useState("4-4-2");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const initialState: TrainingFormState = { errors: {}, message: "", success: false };
  const [state, formAction, isPending] = useActionState(createTacticalBoardAction, initialState);

  const handleSaveCanvas = (data: string, f: string) => {
    setBoardData(data);
    setFormation(f);
  };

  const handleAiSuggest = () => {
    setIsAiLoading(true);
    // AI panel will handle the request
  };

  const handleAiApply = (suggestion: { formation: string; players: Array<{ id: number; role: string; x: number; y: number; label: string }> }) => {
    setFormation(suggestion.formation);
    // Apply to canvas via window
    const applyFn = (window as unknown as Record<string, unknown>).__applyTacticalSuggestion as
      | ((s: typeof suggestion) => void)
      | undefined;
    if (applyFn) {
      applyFn(suggestion);
    }
    setIsAiLoading(false);
  };

  useEffect(() => {
    if (state.success) {
      router.push(`/${locale}/training/tactical-board`);
    }
  }, [state.success, router, locale]);

  // Dictionary fallbacks for client component
  const toolDict = {
    select: "Select",
    arrow: "Arrow",
    line: "Line",
    freeDraw: "Free Draw",
    eraser: "Eraser",
    clearBoard: "Clear",
    aiSuggest: "AI Suggest",
    suggesting: "AI suggesting...",
    saveTactic: "Save",
    homeTeam: "Home Team",
    awayTeam: "Away Team",
  };

  const aiDict = {
    ai: {
      suggestTactic: "AI Suggest Tactic",
      suggesting: "AI is suggesting...",
      error: "AI could not generate a response",
      applySuggestion: "Apply Suggestion",
    },
    tacticalBoard: {
      formation: "Opponent Formation",
      formations: {
        "4-4-2": "4-4-2",
        "4-3-3": "4-3-3",
        "3-5-2": "3-5-2",
        "4-2-3-1": "4-2-3-1",
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/training/tactical-board`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">New Tactical Board</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <TacticalBoardCanvas
            initialFormation={formation}
            onSave={handleSaveCanvas}
            onAiSuggest={handleAiSuggest}
            isAiLoading={isAiLoading}
            dictionary={toolDict}
          />

          {/* Save form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Save Tactic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="boardData" value={boardData} />
                <input type="hidden" name="formation" value={formation} />
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                {state.message && (
                  <p className={`text-sm ${state.success ? "text-green-600" : "text-destructive"}`}>
                    {state.message}
                  </p>
                )}
                <Button type="submit" disabled={isPending || !title}>
                  {isPending ? "Saving..." : "Save Tactic"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <AiTacticsPanel
            locale={locale}
            dictionary={aiDict}
            onApply={handleAiApply}
          />
        </div>
      </div>
    </div>
  );
}
