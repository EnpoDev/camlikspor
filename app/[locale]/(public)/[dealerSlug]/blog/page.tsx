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
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Futbol dünyasından haberler, antrenman ipuçları ve daha fazlası
        </p>
      </div>

      {/* Blog Posts Grid */}
      {posts.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Henüz blog yazısı bulunmuyor.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/${dealerSlug}/blog/${post.slug}`}
              className="group"
            >
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                {post.coverImage && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    {post.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(post.publishedAt), "dd MMM yyyy", {
                            locale: tr,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                {post.excerpt && (
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
