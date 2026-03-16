-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealerId" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "matchDate" DATETIME NOT NULL,
    "venue" TEXT,
    "competition" TEXT,
    "matchType" TEXT NOT NULL DEFAULT 'HOME',
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',
    "homeTeamLogo" TEXT,
    "awayTeamLogo" TEXT,
    "ticketUrl" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Match_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'partner',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sponsor_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- AlterTable: Add banner and section visibility fields to Dealer
ALTER TABLE "Dealer" ADD COLUMN "bannerImage" TEXT;
ALTER TABLE "Dealer" ADD COLUMN "bannerTitle" TEXT;
ALTER TABLE "Dealer" ADD COLUMN "bannerLink" TEXT;
ALTER TABLE "Dealer" ADD COLUMN "showMatchesSection" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Dealer" ADD COLUMN "showNewsSection" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Dealer" ADD COLUMN "showSponsorsSection" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Dealer" ADD COLUMN "showShopPreviewSection" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Dealer" ADD COLUMN "showPreRegSection" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Match_dealerId_idx" ON "Match"("dealerId");
CREATE INDEX "Match_dealerId_isVisible_idx" ON "Match"("dealerId", "isVisible");
CREATE INDEX "Match_matchDate_idx" ON "Match"("matchDate");
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE INDEX "Sponsor_dealerId_idx" ON "Sponsor"("dealerId");
CREATE INDEX "Sponsor_dealerId_isVisible_idx" ON "Sponsor"("dealerId", "isVisible");
CREATE INDEX "Sponsor_tier_idx" ON "Sponsor"("tier");
CREATE INDEX "Sponsor_sortOrder_idx" ON "Sponsor"("sortOrder");
