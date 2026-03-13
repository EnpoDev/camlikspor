import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              Blog
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Futbol Dünyası
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
            Haberler, antrenman ipuçları ve daha fazlası
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full mx-auto mt-6" />
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground text-lg">
                Henüz blog yazısı bulunmuyor.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/${dealerSlug}/blog/${post.slug}`}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border-0 shadow-lg bg-white dark:bg-slate-900">
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
                    <div className="flex items-center gap-2">
                      {post.publishedAt && (
                        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                          <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                            {format(new Date(post.publishedAt), "dd MMM yyyy", {
                              locale: tr,
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  {post.excerpt && (
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-sm group-hover:gap-2 transition-all">
                        Devamını Oku
                        <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
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
