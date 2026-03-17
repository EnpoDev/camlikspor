import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentDevelopment } from "@/lib/actions/students-portal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { TrendingUp, Star, Activity, Brain, Dumbbell } from "lucide-react";

const categoryConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  technical: {
    label: "Teknik",
    icon: Star,
    color: "text-yellow-400",
    bg: "bg-yellow-900/30",
  },
  physical: {
    label: "Fiziksel",
    icon: Dumbbell,
    color: "text-blue-400",
    bg: "bg-blue-900/30",
  },
  mental: {
    label: "Zihinsel",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-900/30",
  },
  tactical: {
    label: "Taktiksel",
    icon: Activity,
    color: "text-green-400",
    bg: "bg-green-900/30",
  },
};

function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-400";
  if (score >= 5) return "text-yellow-400";
  return "text-red-400";
}

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color = score >= 8 ? "bg-green-500" : score >= 5 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default async function StudentDevelopmentPage() {
  const session = await auth();
  if (!session?.user) redirect("/student-login");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const student = await prisma.student.findFirst({
    where: { email: session.user.email! },
    select: { id: true, firstName: true, lastName: true },
  });

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Öğrenci kaydı bulunamadı.</p>
      </div>
    );
  }

  const { developments, categorySummary, totalRecords } =
    await getStudentDevelopment(student.id);

  const hasRecords = totalRecords > 0;

  return (
    <div className="space-y-6">
      {/* Page Hero */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Gelişim Raporu</h1>
            <p className="text-slate-400 text-sm">
              {student.firstName} {student.lastName} &mdash; Performans takibi
            </p>
          </div>
        </div>

        {hasRecords && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg bg-slate-800/60 p-3 text-center">
              <div className="text-2xl font-bold text-white">{totalRecords}</div>
              <div className="text-xs text-slate-400 mt-0.5">Toplam Kayıt</div>
            </div>
            <div className="rounded-lg bg-slate-800/60 p-3 text-center">
              <div className="text-2xl font-bold text-white">
                {categorySummary.length}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Kategori</div>
            </div>
            {categorySummary.length > 0 && (
              <>
                <div className="rounded-lg bg-slate-800/60 p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.max(...categorySummary.map((c) => c.avgScore))}/10
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">En Yüksek Ort.</div>
                </div>
                <div className="rounded-lg bg-slate-800/60 p-3 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {(
                      categorySummary.reduce((s, c) => s + c.avgScore, 0) /
                      categorySummary.length
                    ).toFixed(1)}
                    /10
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Genel Ort.</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {!hasRecords ? (
        /* Empty State */
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="py-16 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Gelişim raporunuz henüz oluşturulmadı
              </h3>
              <p className="text-slate-400 text-sm mt-2 max-w-md">
                Antrenörünüz performans değerlendirmelerinizi girdikçe burada teknik,
                fiziksel ve zihinsel gelişiminizi takip edebileceksiniz. Her antrenman
                sizi daha iyiye götürür!
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge
                variant="outline"
                className="border-yellow-700 text-yellow-400"
              >
                Teknik
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-700 text-blue-400"
              >
                Fiziksel
              </Badge>
              <Badge
                variant="outline"
                className="border-purple-700 text-purple-400"
              >
                Zihinsel
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Category Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categorySummary.map((cat) => {
              const cfg =
                categoryConfig[cat.category] ||
                categoryConfig["technical"];
              const Icon = cfg.icon;
              return (
                <Card
                  key={cat.category}
                  className="bg-slate-900 border-slate-700"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <span className={`${cfg.bg} p-1.5 rounded`}>
                        <Icon className={`h-4 w-4 ${cfg.color}`} />
                      </span>
                      {cfg.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className={`text-3xl font-bold ${getScoreColor(cat.avgScore)}`}>
                      {cat.avgScore}
                      <span className="text-base text-slate-500">/10</span>
                    </div>
                    <ScoreBar score={cat.avgScore} />
                    <p className="text-xs text-slate-500">
                      {cat.recordCount} değerlendirme &bull;{" "}
                      {cat.latestDate
                        ? format(new Date(cat.latestDate), "dd MMM yyyy", {
                            locale: tr,
                          })
                        : ""}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Records */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Değerlendirme Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {developments.map((dev) => {
                  const cfg =
                    categoryConfig[dev.category] || categoryConfig["technical"];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={dev.id}
                      className="flex items-center justify-between rounded-lg bg-slate-800 border border-slate-700 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`${cfg.bg} p-2 rounded`}>
                          <Icon className={`h-4 w-4 ${cfg.color}`} />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {dev.metric}
                          </p>
                          <p className="text-xs text-slate-400">
                            {cfg.label} &bull;{" "}
                            {format(new Date(dev.date), "dd MMMM yyyy", {
                              locale: tr,
                            })}
                          </p>
                          {dev.notes && (
                            <p className="text-xs text-slate-500 mt-0.5 italic">
                              {dev.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xl font-bold ${getScoreColor(dev.score)}`}
                        >
                          {dev.score}
                        </span>
                        <span className="text-slate-500 text-sm">/10</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
