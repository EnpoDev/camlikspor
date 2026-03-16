import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  publishedAt: Date | null;
}

const categoryBadgeStyles: Record<string, string> = {
  duyuru: "bg-red-100 text-red-700",
  turnuva: "bg-yellow-100 text-yellow-700",
  basari: "bg-green-100 text-green-700",
  etkinlik: "bg-blue-100 text-blue-700",
};

function getCategoryBadgeClass(category: string | null): string {
  if (!category) return "bg-slate-100 text-slate-700";
  return categoryBadgeStyles[category.toLowerCase()] || "bg-slate-100 text-slate-700";
}

interface NewsSectionProps {
  posts: NewsPost[];
  locale: string;
  dealerSlug: string;
  dictionary: {
    badge: string;
    title: string;
    subtitle: string;
    featured: string;
    viewAll: string;
  };
}

export function NewsSection({ posts, locale, dealerSlug, dictionary }: NewsSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 4);

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Newspaper className="h-3 w-3 mr-1" />
                {dictionary.badge}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{dictionary.title}</h2>
              <p className="text-muted-foreground">{dictionary.subtitle}</p>
            </div>
            <Link
              href={`/${locale}/${dealerSlug}/blog`}
              className="hidden md:flex items-center gap-2 text-primary hover:text-primary/90 font-semibold transition-colors group"
              aria-label="Tüm haberleri görüntüle"
            >
              {dictionary.viewAll}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>

          {/* News Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Featured News - Large */}
            <Link
              href={`/${locale}/${dealerSlug}/blog/${featuredPost.slug}`}
              className="group"
              aria-label={`${featuredPost.title} haberini oku`}
            >
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                <div className="relative h-80 lg:h-96 overflow-hidden bg-slate-200">
                  {featuredPost.coverImage ? (
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-primary">
                      <Newspaper className="h-20 w-20 text-white/20" aria-hidden="true" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-primary hover:bg-primary text-white border-0">
                        {dictionary.featured}
                      </Badge>
                      {featuredPost.category && (
                        <Badge className={`border-0 ${getCategoryBadgeClass(featuredPost.category)}`}>
                          {featuredPost.category}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-3 line-clamp-2 group-hover:text-secondary transition-colors">
                      {featuredPost.title}
                    </h3>
                    {featuredPost.excerpt && (
                      <p className="text-sm text-white/90 mb-3 line-clamp-2">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      {featuredPost.publishedAt && format(new Date(featuredPost.publishedAt), "d MMMM yyyy", { locale: tr })}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Other News - Small Cards */}
            <div className="flex flex-col gap-6">
              {otherPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/${dealerSlug}/blog/${post.slug}`}
                  className="group block"
                  aria-label={`${post.title} haberini oku`}
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-0">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Image */}
                        <div className="relative w-36 flex-shrink-0 overflow-hidden bg-slate-200">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-200">
                              <Newspaper className="h-10 w-10 text-slate-400" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center p-4">
                          {post.category && (
                            <Badge className={`mb-1.5 w-fit border-0 text-[11px] ${getCategoryBadgeClass(post.category)}`}>
                              {post.category}
                            </Badge>
                          )}
                          <h4 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" aria-hidden="true" />
                            {post.publishedAt && format(new Date(post.publishedAt), "d MMM yyyy", { locale: tr })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile "All News" Button */}
          <div className="mt-8 text-center md:hidden">
            <Link
              href={`/${locale}/${dealerSlug}/blog`}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/90 font-semibold transition-colors group"
              aria-label="Tüm haberleri görüntüle"
            >
              {dictionary.viewAll}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
