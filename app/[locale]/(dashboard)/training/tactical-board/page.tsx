import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Sparkles } from "lucide-react";
import { getTacticalBoards } from "@/lib/data/training";
import Link from "next/link";

interface TacticalBoardPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function TacticalBoardListPage({ params, searchParams }: TacticalBoardPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);
  const sp = await searchParams;

  const dealerId = session?.user?.dealerId;
  if (!dealerId) return null;

  const page = parseInt(sp.page || "1");
  const { data: boards, total } = await getTacticalBoards({ dealerId }, page, 12);
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.training.tacticalBoard.title}
          </h1>
          <p className="text-muted-foreground">
            {dictionary.training.tacticalBoard.boardList}
          </p>
        </div>
        <Link href={`/${locale}/training/tactical-board/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.training.tacticalBoard.addBoard}
          </Button>
        </Link>
      </div>

      {boards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">
              {dictionary.training.tacticalBoard.noBoards}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {dictionary.training.tacticalBoard.createFirst}
            </p>
            <Link href={`/${locale}/training/tactical-board/new`} className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {dictionary.training.tacticalBoard.addBoard}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <Link key={board.id} href={`/${locale}/training/tactical-board/${board.id}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base line-clamp-1">{board.title}</CardTitle>
                      {board.aiGenerated && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="mr-1 h-3 w-3" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {board.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {board.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      {board.formation && (
                        <Badge variant="outline" className="text-xs">
                          {board.formation}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(board.createdAt).toLocaleDateString(locale)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={`/${locale}/training/tactical-board?page=${page - 1}`}>
                  <Button variant="outline" size="sm">{dictionary.common.previous}</Button>
                </Link>
              )}
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`/${locale}/training/tactical-board?page=${page + 1}`}>
                  <Button variant="outline" size="sm">{dictionary.common.next}</Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
