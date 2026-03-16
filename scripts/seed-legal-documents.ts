import { prisma } from "../lib/prisma";

async function seedLegalDocuments() {
  console.log("Seeding legal documents...");

  // Get the first dealer (camlikspor)
  const dealer = await prisma.dealer.findFirst({
    where: { slug: "camlikspor" },
  });

  if (!dealer) {
    console.error("Dealer not found!");
    return;
  }

  const documents = [
    {
      title: "K.V.K.K.",
      slug: "kvkk",
      fileUrl: `/tr/camlikspor/legal/kvkk`,
      sortOrder: 1,
    },
    {
      title: "Gizlilik Politikası",
      slug: "gizlilik-politikasi",
      fileUrl: `/tr/camlikspor/legal/gizlilik-politikasi`,
      sortOrder: 2,
    },
    {
      title: "Çerez Politikası",
      slug: "cerez-politikasi",
      fileUrl: `/tr/camlikspor/legal/cerez-politikasi`,
      sortOrder: 3,
    },
    {
      title: "Kullanım Şartları",
      slug: "kullanim-sartlari",
      fileUrl: `/tr/camlikspor/legal/kullanim-sartlari`,
      sortOrder: 4,
    },
    {
      title: "Mesafeli Satış Sözleşmesi",
      slug: "mesafeli-satis-sozlesmesi",
      fileUrl: `/tr/camlikspor/legal/mesafeli-satis-sozlesmesi`,
      sortOrder: 5,
    },
    {
      title: "İade ve İptal Politikası",
      slug: "iade-ve-iptal-politikasi",
      fileUrl: `/tr/camlikspor/legal/iade-ve-iptal-politikasi`,
      sortOrder: 6,
    },
    {
      title: "Ön Kayıt Sözleşmesi",
      slug: "on-kayit-sozlesmesi",
      fileUrl: `/tr/camlikspor/legal/on-kayit-sozlesmesi`,
      sortOrder: 7,
    },
    {
      title: "Sporcu Sözleşmesi",
      slug: "sporcu-sozlesmesi",
      fileUrl: `https://drive.google.com/file/d/1j2AaMlzYq-dmUysuls8hy-Rs82Yb0_JV/view?usp=sharing`,
      sortOrder: 8,
    },
  ];

  for (const doc of documents) {
    const existing = await prisma.legalDocument.findUnique({
      where: {
        dealerId_slug: {
          dealerId: dealer.id,
          slug: doc.slug,
        },
      },
    });

    if (existing) {
      console.log(`✓ ${doc.title} already exists, updating...`);
      await prisma.legalDocument.update({
        where: { id: existing.id },
        data: {
          title: doc.title,
          fileUrl: doc.fileUrl,
          sortOrder: doc.sortOrder,
          isActive: true,
        },
      });
    } else {
      console.log(`+ Creating ${doc.title}...`);
      await prisma.legalDocument.create({
        data: {
          dealerId: dealer.id,
          title: doc.title,
          slug: doc.slug,
          fileUrl: doc.fileUrl,
          sortOrder: doc.sortOrder,
          isActive: true,
        },
      });
    }
  }

  console.log("✓ Legal documents seeded successfully!");
}

seedLegalDocuments()
  .catch((e) => {
    console.error("Error seeding legal documents:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
