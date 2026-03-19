import { redirect } from "next/navigation";

interface StudentLoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function StudentLoginPage({ params }: StudentLoginPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/login?role=student`);
}
