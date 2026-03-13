import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface BlogPostPageProps {
  params: Promise<{ locale: string; dealerSlug: string; slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: localeParam, dealerSlug, slug } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  // Fetch dealer by slug
  const dealer = await prisma.dealer.findUnique({
    where: {
      slug: dealerSlug,
      isActive: true,
      isPublicPageActive: true,
    },
  });

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href={`/${locale}/${dealerSlug}/blog`}>
            <Button variant="ghost" className="mb-8 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Blog'a Dön
            </Button>
          </Link>

          {/* Article Card */}
          <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative w-full h-[400px] md:h-[500px]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            )}

            {/* Content Container */}
            <div className="p-8 md:p-12">
              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                {post.publishedAt && (
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                    <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                      {format(new Date(post.publishedAt), "dd MMMM yyyy", {
                        locale: tr,
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-light border-l-4 border-emerald-500 pl-6 py-2">
                  {post.excerpt}
                </p>
              )}

              {/* Divider */}
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full mb-12" />

              {/* Content */}
              <div
                className="prose prose-lg md:prose-xl dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-slate-900 dark:prose-h2:text-white prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-slate-800 prose-h2:pb-3
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-emerald-600 dark:prose-h3:text-emerald-400
                  prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
                  prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                  prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:mb-2
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400
                  prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-emerald-600 dark:prose-code:text-emerald-400"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </article>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link href={`/${locale}/${dealerSlug}/blog`}>
              <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tüm Yazıları Gör
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
