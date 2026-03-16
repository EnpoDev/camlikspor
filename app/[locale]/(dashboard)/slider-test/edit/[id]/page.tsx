import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "../../components/blog-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditBlogPostPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  const post = await prisma.blogPost.findFirst({
    where: {
      id,
      dealerId: session.user.dealerId,
    },
  });

  if (!post) {
    notFound();
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
          <h1 className="text-3xl font-bold tracking-tight">Blog Yazısını Düzenle</h1>
          <p className="text-muted-foreground">{post.title}</p>
        </div>
      </div>

      <BlogPostForm
        locale={locale}
        dictionary={dictionary.common}
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          coverImage: post.coverImage || "",
          isPublished: post.isPublished,
          publishedAt: post.publishedAt,
        }}
      />
    </div>
  );
}
