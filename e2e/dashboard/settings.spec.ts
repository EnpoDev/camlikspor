import { test, expect } from '@playwright/test';
import { URLS } from '../helpers/test-data';

test.describe('Dashboard Settings', () => {
  test('settings hub page loads with cards', async ({ page }) => {
    await page.goto(URLS.settings, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: /Ayarlar/ })).toBeVisible();
    // Settings page shows cards in a grid
    const settingsCards = page.locator('a[href*="/tr/settings/"]');
    await expect(settingsCards.first()).toBeVisible();
    expect(await settingsCards.count()).toBeGreaterThan(3);
  });

  test('clicking a settings card navigates to sub-page', async ({ page }) => {
    await page.goto(URLS.settings, { waitUntil: 'networkidle' });

    const firstCard = page.locator('a[href*="/tr/settings/"]').first();
    const href = await firstCard.getAttribute('href');
    await firstCard.click();
    await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
});
