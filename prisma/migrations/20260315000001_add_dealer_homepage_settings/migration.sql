-- AlterTable: Add banner and section visibility fields to Dealer model
ALTER TABLE "Dealer" ADD COLUMN "bannerImage" TEXT;
ALTER TABLE "Dealer" ADD COLUMN "bannerTitle" TEXT;
ALTER TABLE "Dealer" ADD COLUMN "bannerLink" TEXT;
ALTER TABLE "Dealer" ADD COLUMN "showMatchesSection" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Dealer" ADD COLUMN "showNewsSection" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Dealer" ADD COLUMN "showSponsorsSection" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Dealer" ADD COLUMN "showShopPreviewSection" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Dealer" ADD COLUMN "showPreRegSection" BOOLEAN NOT NULL DEFAULT true;
