import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/public/contact-form";
import { ClipboardList } from "lucide-react";

interface PreRegPageProps {
  params: Promise<{ locale: string }>;
}

async function getDefaultDealer() {
  return prisma.dealer.findFirst({
    where: { isActive: true, showPreRegSection: true },
    select: { id: true, name: true, slug: true, showPreRegSection: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function generateMetadata() {
  const dealer = await getDefaultDealer();
  if (!dealer) return { title: "Sayfa Bulunamadı" };

  return {
    title: `Ön Kayıt - ${dealer.name}`,
    description: `${dealer.name} futbol okuluna ön kayıt formu`,
  };
}

export default async function PreRegistrationPage({ params }: PreRegPageProps) {
  const { locale } = await params;
  const dealer = await getDefaultDealer();

  if (!dealer) notFound();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Ön Kayıt Formu</h1>
            <p className="text-muted-foreground text-lg">
              {dealer.name} futbol okuluna kayıt olmak için aşağıdaki formu doldurun.
              En kısa sürede sizinle iletişime geçeceğiz.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <ContactForm
              dealerId={dealer.id}
              dealerSlug={dealer.slug}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
