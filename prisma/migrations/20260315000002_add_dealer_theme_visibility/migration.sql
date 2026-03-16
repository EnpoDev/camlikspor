-- AlterTable: Add matches and sponsors section visibility to DealerTheme
ALTER TABLE "DealerTheme" ADD COLUMN "showMatchesSection" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "DealerTheme" ADD COLUMN "showSponsorsSection" BOOLEAN NOT NULL DEFAULT true;
