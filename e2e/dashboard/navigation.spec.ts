import { test, expect } from '@playwright/test';
import { URLS } from '../helpers/test-data';

test.describe('Dashboard Navigation', () => {
  test('dashboard loads successfully', async ({ page }) => {
    await page.goto(URLS.dashboard, { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/tr\/dashboard/);
  });

  test('sidebar is visible with menu items', async ({ page }) => {
    await page.goto(URLS.dashboard, { waitUntil: 'networkidle' });

    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check key menu items exist in sidebar
    await expect(sidebar.getByText(/Gruplar/).first()).toBeVisible();
    await expect(sidebar.getByText(/Ürünler/).first()).toBeVisible();
    await expect(sidebar.getByText(/Siparişler/).first()).toBeVisible();
  });

  test('navigate to products page', async ({ page }) => {
    await page.goto(URLS.dashboard, { waitUntil: 'networkidle' });

    const sidebar = page.locator('aside');
    await sidebar.locator('a').filter({ hasText: /Ürünler/ }).click();
    await expect(page).toHaveURL(/\/tr\/products/, { timeout: 15000 });
  });

  test('navigate to orders page', async ({ page }) => {
    await page.goto(URLS.dashboard, { waitUntil: 'networkidle' });

    const sidebar = page.locator('aside');
    await sidebar.locator('a').filter({ hasText: /Siparişler/ }).click();
    await expect(page).toHaveURL(/\/tr\/orders/, { timeout: 15000 });
  });
});
