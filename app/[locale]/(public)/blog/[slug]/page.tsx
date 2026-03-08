import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getPublicDealer } from "@/lib/utils/get-public-dealer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: localeParam, slug } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  const dealer = await getPublicDealer();

  if (!dealer) {
    notFound();
  }

  // Fetch blog post
  const post = await prisma.blogPost.findFirst({
    where: {
      dealerId: dealer.id,
      slug: slug,
      isPublished: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href={`/${locale}/blog`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Blog'a Dön
          </Button>
        </Link>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {post.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(post.publishedAt), "dd MMMM yyyy", {
                  locale: tr,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t">
          <Link href={`/${locale}/blog`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tüm Yazıları Gör
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
