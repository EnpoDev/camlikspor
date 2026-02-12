import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Clock, Target, Sparkles } from "lucide-react";
import { getTrainingPlanById } from "@/lib/data/training";
import { ExerciseList } from "@/components/training/exercise-list";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PlanDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function TrainingPlanDetailPage({ params }: PlanDetailPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const dealerId = session?.user?.dealerId;
  if (!dealerId) return null;

  const plan = await getTrainingPlanById(id, dealerId);
  if (!plan) notFound();

  const focusAreas = dictionary.training.plans.focusAreas as Record<string, string>;
  const difficulties = dictionary.training.plans.difficulties as Record<string, string>;
  const statuses = dictionary.training.plans.statuses as Record<string, string>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/training/plans`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{plan.title}</h1>
            <p className="text-muted-foreground">{dictionary.training.plans.planDetail}</p>
          </div>
        </div>
        <Link href={`/${locale}/training/plans/${id}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            {dictionary.common.edit}
          </Button>
        </Link>
      </div>

      {/* Plan Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{plan.title}</CardTitle>
            <div className="flex items-center gap-2">
              {plan.aiGenerated && (
                <Badge variant="secondary">
                  <Sparkles className="mr-1 h-3 w-3" />
                  AI
                </Badge>
              )}
              <Badge>{statuses[plan.status] || plan.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {plan.description && (
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {plan.duration} {dictionary.training.plans.minutes}
            </div>
            {plan.focusArea && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Target className="h-4 w-4" />
                {focusAreas[plan.focusArea] || plan.focusArea}
              </div>
            )}
            <Badge variant="outline">
              {difficulties[plan.difficulty] || plan.difficulty}
            </Badge>
            {plan.targetAgeMin && plan.targetAgeMax && (
              <span className="text-muted-foreground">
                {dictionary.training.plans.targetAge}: {plan.targetAgeMin}-{plan.targetAgeMax}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      <Card>
        <CardContent className="pt-6">
          <ExerciseList
            planId={plan.id}
            exercises={plan.exercises}
            dictionary={dictionary.training.plans as unknown as Record<string, string>}
          />
        </CardContent>
      </Card>
    </div>
  );
}
