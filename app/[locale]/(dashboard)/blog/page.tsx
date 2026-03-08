import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { DeleteBlogButton } from "./components/delete-blog-button";

interface BlogDashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogDashboardPage({
  params,
}: BlogDashboardPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  const posts = await prisma.blogPost.findMany({
    where: {
      dealerId: session.user.dealerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Yönetimi</h1>
          <p className="text-muted-foreground">
            Blog yazılarınızı oluşturun ve yönetin
          </p>
        </div>
        <Link href={`/${locale}/blog/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Yazı
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Henüz blog yazısı oluşturmadınız.
            </p>
            <Link href={`/${locale}/blog/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                İlk Yazınızı Oluşturun
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{post.title}</CardTitle>
                      <Badge variant={post.isPublished ? "default" : "secondary"}>
                        {post.isPublished ? "Yayında" : "Taslak"}
                      </Badge>
                    </div>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>
                        Oluşturulma:{" "}
                        {format(new Date(post.createdAt), "dd MMM yyyy", {
                          locale: tr,
                        })}
                      </span>
                      {post.publishedAt && (
                        <span>
                          Yayın:{" "}
                          {format(new Date(post.publishedAt), "dd MMM yyyy", {
                            locale: tr,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.isPublished && (
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        target="_blank"
                      >
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/${locale}/blog/edit/${post.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteBlogButton postId={post.id} postTitle={post.title} />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
