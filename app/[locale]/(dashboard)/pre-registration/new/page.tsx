import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole, Permission } from "@/lib/types";
import { PreRegistrationForm } from "../components/form";

interface NewPreRegistrationPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewPreRegistrationPage({
  params,
}: NewPreRegistrationPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  // Check permission
  const hasPermission =
    session.user.permissions?.includes(Permission.PRE_REGISTRATION_CREATE) ||
    session.user.role === UserRole.SUPER_ADMIN;

  if (!hasPermission) {
    redirect(`/${locale}/pre-registration`);
  }

  const dictionary = await getDictionary(locale);

  // Get branches for the dealer
  const dealerId = session.user.dealerId;
  const branches = dealerId
    ? await prisma.branch.findMany({
        where: { dealerId, isActive: true },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
    : [];

  return (
    <div className="max-w-2xl mx-auto">
      <PreRegistrationForm
        locale={locale}
        dictionary={dictionary}
        branches={branches}
      />
    </div>
  );
}
