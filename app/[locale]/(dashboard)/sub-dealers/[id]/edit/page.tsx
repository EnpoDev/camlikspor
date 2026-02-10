import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { getSubDealerById } from "@/lib/data/sub-dealers";
import { SubDealerForm } from "../../components/sub-dealer-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface EditSubDealerPageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export default async function EditSubDealerPage({
  params,
}: EditSubDealerPageProps) {
  const { locale, id } = await params;
  const session = await auth();

  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  if (session.user.isSubDealer) {
    redirect(`/${locale}/dashboard`);
  }

  const dict = await getDictionary(locale);

  const subDealer = await getSubDealerById(id, session.user.dealerId);

  if (!subDealer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/sub-dealers/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dict.common?.edit || "Duzenle"}: {subDealer.name}
          </h1>
          <p className="text-muted-foreground">
            Alt bayi bilgilerini guncelleyin
          </p>
        </div>
      </div>

      <SubDealerForm
        locale={locale}
        dictionary={dict}
        initialData={{
          id: subDealer.id,
          name: subDealer.name,
          slug: subDealer.slug,
          email: subDealer.email,
          phone: subDealer.phone,
          address: subDealer.address,
          logo: subDealer.logo,
          customDomain: subDealer.customDomain,
          subdomain: subDealer.subdomain,
          inheritParentProducts: subDealer.inheritParentProducts,
          canCreateOwnProducts: subDealer.canCreateOwnProducts,
        }}
      />
    </div>
  );
}
