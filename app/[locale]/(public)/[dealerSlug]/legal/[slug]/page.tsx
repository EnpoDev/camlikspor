import { notFound } from "next/navigation";
import { Metadata } from "next";
import { resolveDocument } from "@/lib/data/legal-documents";

interface LegalPageProps {
  params: Promise<{
    locale: string;
    dealerSlug: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = resolveDocument(slug);

  if (!doc) {
    return { title: "Sayfa Bulunamadı" };
  }

  return {
    title: `${doc.title} | Çamlık Spor Kulübü`,
    description: doc.title,
  };
}

export default async function LegalDocumentPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const doc = resolveDocument(slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
        <div dangerouslySetInnerHTML={{ __html: doc.content }} />
      </div>
    </div>
  );
}
