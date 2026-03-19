import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
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

  // Estimate reading time (avg 200 words/min Turkish)
  const wordCount = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen">
      {/* Hero Section — dark with cover image */}
      <div className="relative bg-slate-900 overflow-hidden">
        {post.coverImage && (
          <>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60" />
          </>
        )}
        {!post.coverImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        )}

        <div className="container mx-auto relative z-10 max-w-5xl px-4 py-24">
          {/* Back button */}
          <Link href={`/${locale}/${dealerSlug}/blog`}>
            <Button variant="ghost" className="mb-8 text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Blog&apos;a Don
            </Button>
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-slate-900 text-sm font-bold">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(post.publishedAt), "dd MMMM yyyy", { locale: tr })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-white/60 text-sm">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} dk okuma
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-6 text-white animate-fade-in-up">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg md:text-xl max-w-3xl text-white/70 animate-fade-in-up">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Accent Bar */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 py-1" />
      </div>

      {/* Cover Image — full width */}
      {post.coverImage && (
        <div className="relative w-full h-[300px] md:h-[500px]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Divider */}
          <div className="flex items-center gap-2 mb-10">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Makale
            </span>
          </div>

          {/* Article Content */}
          <article
            className="prose prose-lg md:prose-xl max-w-none
              prose-headings:font-black prose-headings:tracking-wide prose-headings:uppercase
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-slate-900 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-3
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-primary
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-li:text-slate-700 prose-li:mb-2
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600
              prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back to Blog CTA */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <Link href={`/${locale}/${dealerSlug}/blog`}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tum Yazilari Gor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
