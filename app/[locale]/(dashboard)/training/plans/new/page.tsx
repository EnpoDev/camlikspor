import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { TrainingPlanForm } from "@/components/forms/training-plan-form";
import { AiTrainingGenerator } from "@/components/training/ai-training-generator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NewPlanPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewTrainingPlanPage({ params }: NewPlanPageProps) {
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/training/plans`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.training.plans.addPlan}
          </h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TrainingPlanForm
          dictionary={{
            plans: dictionary.training.plans as unknown as Record<string, unknown>,
            common: dictionary.common as unknown as Record<string, string>,
          }}
        />
        <AiTrainingGenerator
          locale={locale}
          dictionary={{
            ai: dictionary.training.ai as unknown as Record<string, string>,
            plans: dictionary.training.plans as unknown as Record<string, unknown>,
          }}
        />
      </div>
    </div>
  );
}
