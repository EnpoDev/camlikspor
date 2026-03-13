import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { BlogPostForm } from "../components/blog-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface NewBlogPostPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewBlogPostPage({
  params,
}: NewBlogPostPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/blog`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yeni Blog Yazısı</h1>
          <p className="text-muted-foreground">Yeni bir blog yazısı oluşturun</p>
        </div>
      </div>

      <BlogPostForm locale={locale} dictionary={dictionary.common} />
    </div>
  );
}
