import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { UserRole } from "@/lib/types";
import { getDealerById } from "@/lib/data/dealers";
import { prisma } from "@/lib/prisma";
import { DealerForm } from "@/components/forms/dealer-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { PasswordResetCard } from "../components/password-reset-card";
import { DeleteDealerCard } from "../components/delete-dealer-card";

interface EditDealerPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditDealerPage({ params }: EditDealerPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (session?.user?.role !== UserRole.SUPER_ADMIN) {
    redirect(`/${locale}/dashboard`);
  }

  const dictionary = await getDictionary(locale);
  const dealer = await getDealerById(id);

  if (!dealer) {
    notFound();
  }

  // Get dealer users for password management
  const dealerUsers = await prisma.user.findMany({
    where: { dealerId: id, isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/dealers/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.common.edit}: {dealer.name}
          </h1>
          <p className="text-muted-foreground">
            Bayi bilgilerini guncelleyin
          </p>
        </div>
      </div>

      <DealerForm dealer={dealer} locale={locale} dictionary={dictionary} />

      {/* Password Reset Card */}
      <PasswordResetCard users={dealerUsers} dealerId={id} />

      {/* Delete Dealer Card */}
      <DeleteDealerCard dealerId={id} dealerName={dealer.name} locale={locale} />
    </div>
  );
}
