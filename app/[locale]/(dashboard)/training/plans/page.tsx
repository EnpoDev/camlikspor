import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Target } from "lucide-react";
import { getTrainingPlans } from "@/lib/data/training";
import { TrainingPlanActions } from "@/components/training/training-plan-actions";
import Link from "next/link";

interface PlansPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; search?: string; focusArea?: string; status?: string }>;
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "outline",
};

export default async function TrainingPlansPage({ params, searchParams }: PlansPageProps) {
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
  const { data: plans, total } = await getTrainingPlans(
    {
      dealerId,
      search: sp.search,
      focusArea: sp.focusArea,
      status: sp.status,
    },
    page,
    10
  );

  const totalPages = Math.ceil(total / 10);
  const focusAreas = dictionary.training.plans.focusAreas as Record<string, string>;
  const difficulties = dictionary.training.plans.difficulties as Record<string, string>;
  const statuses = dictionary.training.plans.statuses as Record<string, string>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.training.plans.title}
          </h1>
          <p className="text-muted-foreground">{dictionary.training.plans.planList}</p>
        </div>
        <Link href={`/${locale}/training/plans/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.training.plans.addPlan}
          </Button>
        </Link>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">{dictionary.training.plans.noPlan}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {dictionary.training.plans.createFirst}
            </p>
            <Link href={`/${locale}/training/plans/new`} className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {dictionary.training.plans.addPlan}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Link href={`/${locale}/training/plans/${plan.id}`} className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-1 hover:underline">{plan.title}</CardTitle>
                    </Link>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge variant={STATUS_VARIANTS[plan.status] || "secondary"}>
                        {statuses[plan.status] || plan.status}
                      </Badge>
                      <TrainingPlanActions
                        planId={plan.id}
                        planTitle={plan.title}
                        locale={locale}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/${locale}/training/plans/${plan.id}`}>
                    {plan.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {plan.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                      {plan.focusArea && (
                        <Badge variant="outline" className="text-xs">
                          {focusAreas[plan.focusArea] || plan.focusArea}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {difficulties[plan.difficulty] || plan.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {plan.duration} {dictionary.training.plans.minutes}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                      <span>{plan._count.exercises} {dictionary.training.plans.exercises}</span>
                      {plan.aiGenerated && (
                        <Badge variant="secondary" className="text-[10px]">AI</Badge>
                      )}
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={`/${locale}/training/plans?page=${page - 1}`}>
                  <Button variant="outline" size="sm">{dictionary.common.previous}</Button>
                </Link>
              )}
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`/${locale}/training/plans?page=${page + 1}`}>
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
