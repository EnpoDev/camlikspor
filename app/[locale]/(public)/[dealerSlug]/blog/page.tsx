import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Newspaper, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface BlogPageProps {
  params: Promise<{ locale: string; dealerSlug: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale: localeParam, dealerSlug } = await params;

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

  // Fetch published blog posts
  const posts = await prisma.blogPost.findMany({
    where: {
      dealerId: dealer.id,
      isPublished: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section — dark */}
      <div className="relative bg-slate-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-slate-900 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            Blog
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-4 text-white animate-fade-in-up">
            Futbol Dunyasi
          </h1>
          <p className="text-lg md:text-xl max-w-3xl text-white/70 animate-fade-in-up">
            Haberler, antrenman ipuclari ve daha fazlasi
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Newspaper className="h-5 w-5 text-white/60" />
            <span className="text-2xl font-black text-white">{posts.length}</span>
            <span className="text-sm text-white/70 font-medium uppercase tracking-wide">Yazi</span>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Yazilar
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Son Yazilar
          </h2>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="h-24 w-24 mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-bold mb-2 text-slate-900">Henuz Yazi Yok</h3>
            <p className="text-slate-500">Blog yazilari yakinda eklenecek.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/${dealerSlug}/blog/${post.slug}`}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {post.coverImage && (
                    <div className="relative w-full h-56 overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  )}
                  <CardHeader className="space-y-3">
                    {post.publishedAt && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs text-primary font-medium">
                          {format(new Date(post.publishedAt), "dd MMM yyyy", { locale: tr })}
                        </span>
                      </div>
                    )}
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  {post.excerpt && (
                    <CardContent>
                      <p className="text-slate-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center text-primary font-bold text-sm uppercase tracking-wide group-hover:gap-2 transition-all">
                        Devamini Oku
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
