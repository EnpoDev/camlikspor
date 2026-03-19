import { redirect } from "next/navigation";

interface ParentLoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ParentLoginPage({ params }: ParentLoginPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/login?role=parent`);
}
