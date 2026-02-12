import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { TrainingPlanForm } from "@/components/forms/training-plan-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getTrainingPlanById } from "@/lib/data/training";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditPlanPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditTrainingPlanPage({ params }: EditPlanPageProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/training/plans/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.training.plans.editPlan}
          </h1>
        </div>
      </div>

      <TrainingPlanForm
        plan={plan}
        dictionary={{
          plans: dictionary.training.plans as unknown as Record<string, unknown>,
          common: dictionary.common as unknown as Record<string, string>,
        }}
      />
    </div>
  );
}
