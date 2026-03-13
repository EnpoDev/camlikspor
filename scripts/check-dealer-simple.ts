import { prisma } from "../lib/prisma";

async function check() {
  // Find camlikspor dealer
  const camlikspor = await prisma.dealer.findUnique({
    where: { slug: "camlikspor" },
  });

  console.log("\nCamlikspor Dealer:");
  console.log(`ID: ${camlikspor?.id}`);
  console.log(`Name: ${camlikspor?.name}`);

  // Find legal docs for this dealer
  if (camlikspor) {
    const docs = await prisma.legalDocument.findMany({
      where: { dealerId: camlikspor.id, isActive: true },
      orderBy: [{ sortOrder: "asc" }],
    });

    console.log(`\nLegal Documents: ${docs.length}`);
    docs.forEach((doc, i) => {
      console.log(`${i + 1}. ${doc.title} (${doc.slug})`);
      console.log(`   URL: ${doc.fileUrl}`);
    });
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
