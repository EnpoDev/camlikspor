"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useFormLoading } from "@/lib/hooks/use-form-loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  createBlogPostAction,
  updateBlogPostAction,
  type BlogFormState,
} from "@/lib/actions/blog";

interface BlogPostFormProps {
  locale: string;
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    isPublished: boolean;
    publishedAt: Date | null;
  };
  dictionary: {
    save: string;
    cancel: string;
    loading: string;
  };
}

export function BlogPostForm({
  locale,
  initialData,
  dictionary,
}: BlogPostFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished ?? false
  );

  const initialState: BlogFormState = {
    errors: {},
    message: undefined,
    success: false,
  };

  const boundAction = isEdit
    ? updateBlogPostAction.bind(null, initialData.id)
    : createBlogPostAction;

  const [state, formAction, isPending] = useActionState(
    async (prevState: BlogFormState, formData: FormData) => {
      formData.set("isPublished", String(isPublished));

      const result = await boundAction(prevState, formData);

      if (result.success) {
        toast.success(
          isEdit ? "Blog yazısı güncellendi" : "Blog yazısı oluşturuldu"
        );
        router.push(`/${locale}/blog`);
      } else if (result.message) {
        toast.error(result.message);
      }

      return result;
    },
    initialState
  );

  useFormLoading(isPending);

  const generateSlug = (title: string) => {
    const turkishMap: Record<string, string> = {
      ç: "c",
      ğ: "g",
      ı: "i",
      ö: "o",
      ş: "s",
      ü: "u",
      Ç: "c",
      Ğ: "g",
      İ: "i",
      Ö: "o",
      Ş: "s",
      Ü: "u",
    };

    return title
      .toLowerCase()
      .split("")
      .map((char) => turkishMap[char] || char)
      .join("")
      .replace(/[^a-z0-9\\s-]/g, "")
      .replace(/\\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Temel Bilgiler</CardTitle>
          <CardDescription>Blog yazısının temel bilgilerini girin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title}
              required
              onChange={(e) => {
                const slugInput = document.getElementById(
                  "slug"
                ) as HTMLInputElement;
                if (slugInput && !initialData) {
                  slugInput.value = generateSlug(e.target.value);
                }
              }}
            />
            {state.errors?.title && (
              <p className="text-sm text-destructive">{state.errors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={initialData?.slug}
              required
            />
            {state.errors?.slug && (
              <p className="text-sm text-destructive">{state.errors.slug[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Özet</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              defaultValue={initialData?.excerpt}
              rows={3}
              placeholder="Blog yazısının kısa özeti"
            />
            {state.errors?.excerpt && (
              <p className="text-sm text-destructive">
                {state.errors.excerpt[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Kapak Görseli URL</Label>
            <Input
              id="coverImage"
              name="coverImage"
              type="url"
              defaultValue={initialData?.coverImage}
              placeholder="https://example.com/image.jpg"
            />
            {state.errors?.coverImage && (
              <p className="text-sm text-destructive">
                {state.errors.coverImage[0]}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="isPublished">Yayınla</Label>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>İçerik</CardTitle>
          <CardDescription>Blog yazısının içeriğini yazın</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">İçerik *</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={initialData?.content}
              rows={20}
              required
              placeholder="Blog yazınızı buraya yazın..."
              className="font-mono text-sm"
            />
            {state.errors?.content && (
              <p className="text-sm text-destructive">
                {state.errors.content[0]}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              HTML etiketleri kullanabilirsiniz
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/blog`)}
        >
          {dictionary.cancel}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {dictionary.loading}
            </>
          ) : (
            dictionary.save
          )}
        </Button>
      </div>
    </form>
  );
}
