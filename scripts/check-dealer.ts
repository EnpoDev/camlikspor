import { getPublicDealer } from "../lib/utils/get-public-dealer";
import { prisma } from "../lib/prisma";

async function checkDealer() {
  const dealer = await getPublicDealer();

  console.log("\nPublic Dealer:");
  console.log(`ID: ${dealer?.id}`);
  console.log(`Name: ${dealer?.name}`);
  console.log(`Slug: ${dealer?.slug}\n`);

  // Check all dealers
  const allDealers = await prisma.dealer.findMany({
    select: { id: true, name: true, slug: true },
  });

  console.log("All Dealers:");
  allDealers.forEach((d) => {
    console.log(`  ${d.slug} - ${d.name} (${d.id})`);
  });

  // Check legal docs for this dealer
  const docs = await prisma.legalDocument.findMany({
    where: { dealerId: dealer?.id || "" },
  });

  console.log(`\nLegal Docs for ${dealer?.slug}: ${docs.length}`);
  docs.forEach((doc) => {
    console.log(`  - ${doc.title}`);
  });
}

checkDealer()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
