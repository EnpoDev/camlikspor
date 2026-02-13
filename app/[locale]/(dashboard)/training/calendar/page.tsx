import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getTrainingSessions, getTrainingPlansForCalendar } from "@/lib/data/training";
import { TrainingCalendar } from "@/components/training/training-calendar";

interface CalendarPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TrainingCalendarPage({ params }: CalendarPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const dealerId = session?.user?.dealerId;
  if (!dealerId) return null;

  // Get sessions for the current and adjacent months
  const now = new Date();
  const dateFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const dateTo = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  const [sessions, plans] = await Promise.all([
    getTrainingSessions(dealerId, dateFrom, dateTo),
    getTrainingPlansForCalendar(dealerId, dateFrom, dateTo),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.training.calendar.title}
        </h1>
      </div>

      <TrainingCalendar
        sessions={sessions.map((s) => ({
          ...s,
          date: new Date(s.date),
        }))}
        plans={plans.map((p) => ({
          ...p,
          date: p.date ? new Date(p.date) : new Date(),
        }))}
        dictionary={{
          calendar: dictionary.training.calendar as unknown as Record<string, unknown>,
          plans: dictionary.training.plans as unknown as Record<string, unknown>,
        }}
        locale={locale}
      />
    </div>
  );
}
