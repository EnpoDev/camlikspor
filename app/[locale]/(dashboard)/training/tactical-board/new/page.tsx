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

const translations = {
  tr: {
    newTacticalBoard: "Yeni Taktik Tahtası",
    saveTactic: "Taktiği Kaydet",
    title: "Başlık",
    description: "Açıklama",
    saving: "Kaydediliyor...",
    tools: {
      select: "Seç",
      arrow: "Ok",
      line: "Çizgi",
      freeDraw: "Serbest Çizim",
      eraser: "Silgi",
      clearBoard: "Tahtayı Temizle",
      aiSuggest: "AI Taktik Öner",
      suggesting: "AI taktik öneriyor...",
      saveTactic: "Kaydet",
      homeTeam: "Ev Sahibi",
      awayTeam: "Deplasman",
    },
    ai: {
      suggestTactic: "AI Taktik Öner",
      suggesting: "AI taktik öneriyor...",
      error: "AI yanıt oluşturamadı",
      applySuggestion: "Öneriyi Uygula",
      teamStrengths: "Takım Güçlü Yönleri",
      teamWeaknesses: "Takım Zayıf Yönleri",
      strengthsPlaceholder: "Hızlı kanatçılar, güçlü orta saha...",
      weaknessesPlaceholder: "Zayıf hava savunması...",
    },
    tacticalBoard: {
      formation: "Rakip Diziliş",
      formations: {
        "4-4-2": "4-4-2",
        "4-3-3": "4-3-3",
        "3-5-2": "3-5-2",
        "4-2-3-1": "4-2-3-1",
      },
    },
  },
  en: {
    newTacticalBoard: "New Tactical Board",
    saveTactic: "Save Tactic",
    title: "Title",
    description: "Description",
    saving: "Saving...",
    tools: {
      select: "Select",
      arrow: "Arrow",
      line: "Line",
      freeDraw: "Free Draw",
      eraser: "Eraser",
      clearBoard: "Clear Board",
      aiSuggest: "AI Suggest",
      suggesting: "AI suggesting...",
      saveTactic: "Save",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
    },
    ai: {
      suggestTactic: "AI Suggest Tactic",
      suggesting: "AI is suggesting...",
      error: "AI could not generate a response",
      applySuggestion: "Apply Suggestion",
      teamStrengths: "Team Strengths",
      teamWeaknesses: "Team Weaknesses",
      strengthsPlaceholder: "Fast wingers, strong midfield...",
      weaknessesPlaceholder: "Weak aerial defense...",
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
  },
  es: {
    newTacticalBoard: "Nuevo Tablero Táctico",
    saveTactic: "Guardar Táctica",
    title: "Título",
    description: "Descripción",
    saving: "Guardando...",
    tools: {
      select: "Seleccionar",
      arrow: "Flecha",
      line: "Línea",
      freeDraw: "Dibujo Libre",
      eraser: "Borrador",
      clearBoard: "Limpiar Tablero",
      aiSuggest: "IA Sugerir",
      suggesting: "IA sugiriendo...",
      saveTactic: "Guardar",
      homeTeam: "Equipo Local",
      awayTeam: "Equipo Visitante",
    },
    ai: {
      suggestTactic: "IA Sugerir Táctica",
      suggesting: "IA está sugiriendo...",
      error: "IA no pudo generar una respuesta",
      applySuggestion: "Aplicar Sugerencia",
      teamStrengths: "Fortalezas del Equipo",
      teamWeaknesses: "Debilidades del Equipo",
      strengthsPlaceholder: "Extremos rápidos, mediocampo fuerte...",
      weaknessesPlaceholder: "Defensa aérea débil...",
    },
    tacticalBoard: {
      formation: "Formación Rival",
      formations: {
        "4-4-2": "4-4-2",
        "4-3-3": "4-3-3",
        "3-5-2": "3-5-2",
        "4-2-3-1": "4-2-3-1",
      },
    },
  },
};

export default function NewTacticalBoardPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "tr";
  const t = translations[locale as keyof typeof translations] || translations.tr;

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

  const handleFormSubmit = (formData: FormData) => {
    // Get latest canvas data before submit
    const getCanvasData = (window as unknown as Record<string, unknown>).__getTacticalBoardData as
      | (() => { data: string; formation: string })
      | undefined;
    if (getCanvasData) {
      const { data, formation: f } = getCanvasData();
      formData.set("boardData", data);
      formData.set("formation", f);
    }
    formAction(formData);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/training/tactical-board`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{t.newTacticalBoard}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <TacticalBoardCanvas
            initialFormation={formation}
            onSave={handleSaveCanvas}
            onAiSuggest={handleAiSuggest}
            isAiLoading={isAiLoading}
            dictionary={t.tools}
          />

          {/* Save form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                {t.saveTactic}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t.title}</Label>
                  <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t.description}</Label>
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
                  {isPending ? t.saving : t.saveTactic}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <AiTacticsPanel
            locale={locale}
            dictionary={{
              ai: t.ai,
              tacticalBoard: t.tacticalBoard,
            }}
            onApply={handleAiApply}
          />
        </div>
      </div>
    </div>
  );
}
