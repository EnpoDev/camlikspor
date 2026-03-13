import { prisma } from "../lib/prisma";

async function checkLegalDocs() {
  const docs = await prisma.legalDocument.findMany({
    orderBy: { sortOrder: "asc" },
  });

  console.log(`\nFound ${docs.length} legal documents:\n`);

  docs.forEach((doc) => {
    console.log(`${doc.sortOrder}. ${doc.title}`);
    console.log(`   Slug: ${doc.slug}`);
    console.log(`   URL: ${doc.fileUrl}`);
    console.log(`   Active: ${doc.isActive}`);
    console.log(`   Dealer ID: ${doc.dealerId}\n`);
  });
}

checkLegalDocs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
