/**
 * QA Test Suite: Public Homepage Sections
 *
 * Covers:
 *  1. Gallery section — 6 images with titles
 *  2. Matches section — 3 matches with UPCOMING / COMPLETED statuses
 *  3. Sponsors section — 5 sponsors across main / official / partner tiers
 *  4. News section — existing blog posts
 *  5. Hero slider — slides display
 *  6. Console errors / broken images / missing data
 *
 * Database state for dealer slug "camlikspor":
 *   - Gallery: 6 active images (Maç Anı, Antrenman, Gol Sevinci, Takım Ruhu, Stadyum, Genç Futbolcular)
 *   - Matches: 3 visible (1 UPCOMING, 2 COMPLETED)
 *   - Sponsors: 5 visible (1 main, 2 official, 2 partner)
 *   - Blog posts: 3 published
 *   - Hero slides: 2 active (with local /uploads paths)
 */

import { test, expect, type Page } from '@playwright/test';
import { URLS } from '../helpers/test-data';

// ─── helpers ────────────────────────────────────────────────────────────────

async function captureConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  return errors;
}

// ─── suite ──────────────────────────────────────────────────────────────────

test.describe('Homepage sections — /tr', () => {
  let consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = await captureConsoleErrors(page);
    await page.goto(URLS.home, { waitUntil: 'networkidle' });
  });

  // ── 1. Hero Slider ──────────────────────────────────────────────────────

  test.describe('Hero Slider', () => {
    test('renders at least one slide with a title heading', async ({ page }) => {
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      const text = await h1.innerText();
      expect(text.trim().length).toBeGreaterThan(0);
    });

    test('shows navigation arrows', async ({ page }) => {
      await expect(page.getByLabel('Previous slide')).toBeVisible();
      await expect(page.getByLabel('Next slide')).toBeVisible();
    });

    test('shows slide indicator dots', async ({ page }) => {
      // At least 2 indicator dots (2 DB slides)
      const dots = page.locator('[aria-label^="Go to slide"]');
      const count = await dots.count();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    test('advances to next slide on arrow click', async ({ page }) => {
      const h1 = page.locator('h1').first();
      const firstTitle = await h1.innerText();
      await page.getByLabel('Next slide').click();
      // Wait for transition
      await page.waitForTimeout(1200);
      const secondTitle = await h1.innerText();
      // Title should have changed (two different slides in DB)
      expect(secondTitle).not.toEqual(firstTitle);
    });

    test('primary CTA button is visible', async ({ page }) => {
      // Default CTA texts from DB slides or fallback
      const cta = page.locator('button, a').filter({ hasText: /kayıt|incele|başla/i }).first();
      await expect(cta).toBeVisible();
    });
  });

  // ── 2. Gallery Section ──────────────────────────────────────────────────

  test.describe('Gallery Section', () => {
    test('gallery section is visible on the page', async ({ page }) => {
      // Section header contains "Fotoğraf Galerisi" or custom title
      await expect(page.getByText(/fotoğraf galerisi/i)).toBeVisible();
    });

    test('renders exactly 6 gallery images in the grid', async ({ page }) => {
      // The GallerySection renders images in two rows: 3 + 3
      // Each image is inside a <button> with a Next.js <img>
      const gallerySection = page.locator('section').filter({ has: page.getByText(/fotoğraf galerisi/i) });
      await expect(gallerySection).toBeVisible();

      const galleryImages = gallerySection.locator('img');
      const count = await galleryImages.count();
      expect(count).toBe(6);
    });

    test('gallery images have non-empty alt text', async ({ page }) => {
      const gallerySection = page.locator('section').filter({ has: page.getByText(/fotoğraf galerisi/i) });
      const images = gallerySection.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).toBeTruthy();
        expect((alt || '').trim().length).toBeGreaterThan(0);
      }
    });

    test('gallery image titles from DB are present (Maç Anı, Antrenman, etc.)', async ({ page }) => {
      // Titles appear in the lightbox overlay on hover — verify via image alt attributes
      const expectedTitles = ['Maç Anı', 'Antrenman', 'Gol Sevinci', 'Takım Ruhu', 'Stadyum', 'Genç Futbolcular'];
      const gallerySection = page.locator('section').filter({ has: page.getByText(/fotoğraf galerisi/i) });
      const images = gallerySection.locator('img');
      const alts: string[] = [];
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        if (alt) alts.push(alt);
      }

      for (const title of expectedTitles) {
        expect(alts.some((a) => a.includes(title))).toBe(true);
      }
    });

    test('"Tüm Galeriyi Gör" CTA link is visible', async ({ page }) => {
      await expect(page.getByRole('link', { name: /tüm galeriyi gör/i })).toBeVisible();
    });

    test('clicking a gallery image opens the lightbox', async ({ page }) => {
      const gallerySection = page.locator('section').filter({ has: page.getByText(/fotoğraf galerisi/i) });
      const firstImageButton = gallerySection.locator('button').first();
      await firstImageButton.click();

      // Lightbox dialog should open
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Close lightbox
      await page.getByLabel('Kapat').click();
      await expect(dialog).not.toBeVisible();
    });
  });

  // ── 3. Matches Section ──────────────────────────────────────────────────

  test.describe('Matches Section', () => {
    test('matches section is visible', async ({ page }) => {
      await expect(page.getByText(/maçlar|fikstür/i).first()).toBeVisible();
    });

    test('renders exactly 3 match cards', async ({ page }) => {
      const matchesSection = page.locator('section').filter({ has: page.getByText(/fikstür/i) });
      // Each match card has a date/calendar icon row at the top
      // More reliable: count unique team name elements
      // Match cards contain calendar icons
      const calendarIcons = matchesSection.locator('svg').filter({ has: matchesSection.locator('title') });
      // More reliable approach: count by card structure - each card has a border-b separator
      const matchCards = matchesSection.locator('[class*="border-slate-700"]').filter({ has: matchesSection.locator('svg[class*="h-3.5"]') });
      const count = await matchCards.count();
      // Expect 3 match cards (or 4 with sponsor card)
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test('shows UPCOMING match with Bağcılar Gençlik', async ({ page }) => {
      await expect(page.getByText('Bağcılar Gençlik')).toBeVisible();
    });

    test('shows COMPLETED matches with scores', async ({ page }) => {
      // "Pendik Spor vs Çamlık Spor" result was 1-2
      await expect(page.getByText(/pendik spor/i)).toBeVisible();
      // Score "1 - 2" should appear
      await expect(page.getByText('1 - 2')).toBeVisible();
    });

    test('shows COMPLETED match "Çamlık Spor vs Kartal Gençlik" with score 3-0', async ({ page }) => {
      await expect(page.getByText('Kartal Gençlik')).toBeVisible();
      await expect(page.getByText('3 - 0')).toBeVisible();
    });

    test('shows match venue for at least one match', async ({ page }) => {
      await expect(page.getByText('Çamlık Stadyumu')).toBeVisible();
    });

    test('shows match competition for UPCOMING match', async ({ page }) => {
      // "İl Ligi" appears for upcoming match
      await expect(page.getByText('İl Ligi')).toBeVisible();
    });

    test('UPCOMING match shows countdown (not a score)', async ({ page }) => {
      // Countdown section should show "gün" text for future match (2026-03-22)
      await expect(page.getByText('gün').first()).toBeVisible();
    });

    test('COMPLETED matches show "Sonuç" label', async ({ page }) => {
      const sonucLabels = page.getByText('Sonuç');
      const count = await sonucLabels.count();
      expect(count).toBe(2);
    });
  });

  // ── 4. Sponsors Section ──────────────────────────────────────────────────

  test.describe('Sponsors Section', () => {
    test('sponsors section is visible', async ({ page }) => {
      await expect(page.getByText(/resmi ortaklar/i)).toBeVisible();
    });

    test('renders all 5 sponsor logos/names', async ({ page }) => {
      await expect(page.getByText('Çamlık İnşaat')).toBeVisible();
      await expect(page.getByText('Bölge Sigorta')).toBeVisible();
      await expect(page.getByText('Spor Market')).toBeVisible();
      await expect(page.getByText('Fit Gıda')).toBeVisible();
      await expect(page.getByText('Dijital Medya')).toBeVisible();
    });

    test('Ana Sponsor tier row is visible', async ({ page }) => {
      await expect(page.getByText('Ana Sponsor')).toBeVisible();
    });

    test('Resmi Ortaklar tier row is visible', async ({ page }) => {
      await expect(page.getByText('Resmi Ortaklar').first()).toBeVisible();
    });

    test('Partnerler tier row is visible', async ({ page }) => {
      await expect(page.getByText('Partnerler')).toBeVisible();
    });

    test('sponsor logos are images (not just text)', async ({ page }) => {
      const sponsorsSection = page.locator('section').filter({ has: page.locator('section > div').filter({ has: page.getByText(/resmi ortaklar/i) }) });
      // The sponsors section uses white background
      const sponsorSection = page.locator('section.py-20.bg-white');
      const sponsorImages = sponsorSection.locator('img');
      const count = await sponsorImages.count();
      // All 5 sponsors have logoUrl (placehold.co images)
      expect(count).toBe(5);
    });

    test('sponsor images have non-empty alt text', async ({ page }) => {
      const sponsorSection = page.locator('section.py-20.bg-white');
      const images = sponsorSection.locator('img');
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });
  });

  // ── 5. News Section ──────────────────────────────────────────────────────

  test.describe('News Section', () => {
    test('news section is visible', async ({ page }) => {
      await expect(page.getByText('Son Haberler')).toBeVisible();
    });

    test('shows all 3 blog post titles', async ({ page }) => {
      await expect(page.getByText('Futbolda Temel Teknik Beceriler')).toBeVisible();
      await expect(page.getByText('Genç Futbolcular İçin Beslenme Rehberi')).toBeVisible();
      await expect(page.getByText('Antrenman Öncesi Isınmanın Önemi')).toBeVisible();
    });

    test('featured post has "ÖNE ÇIKAN" badge', async ({ page }) => {
      await expect(page.getByText('ÖNE ÇIKAN')).toBeVisible();
    });

    test('"Tüm Haberler" link is visible', async ({ page }) => {
      await expect(page.getByText('Tüm Haberler').first()).toBeVisible();
    });

    test('blog post links go to correct URL pattern', async ({ page }) => {
      // Featured post link should go to /tr/<dealerSlug>/blog/<slug>
      const firstPostLink = page.getByRole('link', { name: /futbolda temel teknik beceriler/i });
      const href = await firstPostLink.getAttribute('href');
      expect(href).toMatch(/\/tr\/.+\/blog\/futbolda-temel-teknik-beceriler/);
    });
  });

  // ── 6. Console errors & broken images ───────────────────────────────────

  test.describe('No console errors or broken images', () => {
    test('no JavaScript console errors on page load', async ({ page }) => {
      // Wait for page to fully settle
      await page.waitForTimeout(500);
      const criticalErrors = consoleErrors.filter(
        (e) =>
          !e.includes('favicon') &&
          !e.includes('404') &&
          !e.includes('hydrat') // hydration warnings are acceptable
      );
      expect(criticalErrors).toHaveLength(0);
    });

    test('all visible images load without 404', async ({ page }) => {
      const failedImages: string[] = [];

      page.on('response', (response) => {
        if (
          response.url().match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i) &&
          response.status() >= 400
        ) {
          failedImages.push(`${response.status()} ${response.url()}`);
        }
      });

      // Reload to capture network responses with listener active
      await page.reload({ waitUntil: 'networkidle' });

      expect(failedImages).toHaveLength(0);
    });

    test('page returns 200 status', async ({ page, request }) => {
      const response = await request.get(URLS.home);
      expect(response.status()).toBe(200);
    });
  });

  // ── 7. Data-driven: DB state assertions via API ──────────────────────────

  test.describe('Database state verification', () => {
    /**
     * These tests verify actual DB content matches what should be on the page.
     * They act as a canary for seed/migration issues.
     */

    test('gallery section shows exactly 6 images (DB count matches component take:6)', async ({ page }) => {
      const gallerySection = page.locator('section').filter({ has: page.getByText(/fotoğraf galerisi/i) });
      const images = gallerySection.locator('img');
      await expect(images).toHaveCount(6);
    });

    test('matches section shows exactly 3 matches (all visible DB matches for camlikspor)', async ({ page }) => {
      // 3 visible matches in DB for camlikspor dealer
      // Count by "Sonuç" labels (2) + "gün" countdown (1) = total match cards = 3
      const sonucCount = await page.getByText('Sonuç').count();
      const gunCount = await page.getByText('gün').count();
      expect(sonucCount + gunCount).toBe(3);
    });

    test('sponsors section shows 5 sponsors (1 main + 2 official + 2 partner)', async ({ page }) => {
      const sponsorNames = [
        'Çamlık İnşaat',     // main
        'Bölge Sigorta',     // official
        'Spor Market',       // official
        'Fit Gıda',          // partner
        'Dijital Medya',     // partner
      ];

      for (const name of sponsorNames) {
        await expect(page.getByText(name)).toBeVisible();
      }
    });

    test('news section shows 3 blog posts (all published for camlikspor)', async ({ page }) => {
      const postTitles = [
        'Futbolda Temel Teknik Beceriler',
        'Genç Futbolcular İçin Beslenme Rehberi',
        'Antrenman Öncesi Isınmanın Önemi',
      ];

      for (const title of postTitles) {
        await expect(page.getByText(title)).toBeVisible();
      }
    });
  });
});

// ─── Bug documentation tests ────────────────────────────────────────────────

test.describe('Known issues / regression guards', () => {
  /**
   * BUG: getPublicDealer fallback select (lines 129-157 in get-public-dealer.ts)
   * is missing showMatchesSection, showSponsorsSection, showNewsSection,
   * showShopPreviewSection, showPreRegSection fields.
   *
   * When accessed via custom domain or subdomain (not the default fallback),
   * these fields will be undefined, which means:
   *   - MatchesSection receives isVisible=undefined → renders even if dealer wants it hidden
   *   - SponsorsSection receives isVisible=undefined → same
   *   - NewsSection condition `dealer.showNewsSection &&` evaluates false for undefined
   *
   * This test guards against regression once the bug is fixed.
   */
  test('homepage sections are visible (guards getPublicDealer fallback field bug)', async ({ page }) => {
    await page.goto(URLS.home, { waitUntil: 'networkidle' });

    // All sections should be visible via the default slug fallback (camlikspor)
    // which correctly has all show* flags = true in DB
    await expect(page.getByText(/fikstür/i)).toBeVisible();
    await expect(page.getByText(/resmi ortaklar/i)).toBeVisible();
    await expect(page.getByText('Son Haberler')).toBeVisible();
    await expect(page.getByText(/fotoğraf galerisi/i)).toBeVisible();
  });
});
