import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getTacticalBoardById } from "@/lib/data/training";
import { TacticalBoardCanvas } from "@/components/training/tactical-board-canvas";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TacticalBoardDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function TacticalBoardDetailPage({ params }: TacticalBoardDetailPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const dealerId = session?.user?.dealerId;
  if (!dealerId) return null;

  const board = await getTacticalBoardById(id, dealerId);
  if (!board) notFound();

  const toolDict: Record<string, string> = {
    select: (dictionary.training.tacticalBoard.tools as Record<string, string>).select,
    arrow: (dictionary.training.tacticalBoard.tools as Record<string, string>).arrow,
    line: (dictionary.training.tacticalBoard.tools as Record<string, string>).line,
    freeDraw: (dictionary.training.tacticalBoard.tools as Record<string, string>).freeDraw,
    eraser: (dictionary.training.tacticalBoard.tools as Record<string, string>).eraser,
    clearBoard: dictionary.training.tacticalBoard.clearBoard,
    saveTactic: dictionary.training.tacticalBoard.saveTactic,
    homeTeam: dictionary.training.tacticalBoard.homeTeam,
    awayTeam: dictionary.training.tacticalBoard.awayTeam,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/training/tactical-board`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{board.title}</h1>
            {board.description && (
              <p className="text-muted-foreground">{board.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {board.formation && (
            <Badge variant="outline">{board.formation}</Badge>
          )}
          {board.aiGenerated && (
            <Badge variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" />
              AI
            </Badge>
          )}
        </div>
      </div>

      <TacticalBoardCanvas
        initialData={board.boardData || undefined}
        initialFormation={board.formation || "4-4-2"}
        dictionary={toolDict}
      />
    </div>
  );
}
