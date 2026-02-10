import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SubDealerForm } from "../components/sub-dealer-form";

interface NewSubDealerPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function NewSubDealerPage({
  params,
}: NewSubDealerPageProps) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  if (session.user.isSubDealer) {
    redirect(`/${locale}/dashboard`);
  }

  const dict = await getDictionary(locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/sub-dealers`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dict.subDealers?.create || "Yeni Alt Bayi"}
          </h1>
          <p className="text-muted-foreground">
            {dict.subDealers?.formDescription || "Alt bayi detaylarini girin"}
          </p>
        </div>
      </div>

      <SubDealerForm locale={locale} dictionary={dict} />
    </div>
  );
}
