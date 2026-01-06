import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CashRegisterPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CashRegisterPage({ params }: CashRegisterPageProps) {
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.accounting.cashRegister.title}
          </h1>
          <p className="text-muted-foreground">
            {dictionary.accounting.cashRegister.allBranches}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {dictionary.accounting.cashRegister.addTransaction}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              {dictionary.accounting.cashRegister.totalIncome}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0 TL</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              {dictionary.accounting.cashRegister.totalExpense}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">0 TL</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {dictionary.accounting.cashRegister.balance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 TL</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Son Islemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            {dictionary.common.noData}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
