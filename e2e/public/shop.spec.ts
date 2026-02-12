import { test, expect } from '@playwright/test';
import { URLS } from '../helpers/test-data';

test.describe('Shop Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.shop);
  });

  test('page loads with product cards', async ({ page }) => {
    // Use heading locator to avoid matching sidebar button with same text
    await expect(page.locator('h1').filter({ hasText: 'Tüm Ürünler' })).toBeVisible();
    const productCards = page.locator('a[href*="/tr/shop/"]');
    await expect(productCards.first()).toBeVisible();
  });

  test('category filter works', async ({ page }) => {
    // Categories are <Link><Button> in the sidebar
    const categoryButton = page.locator('aside a').filter({ hasText: /Formalar/ });
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      await expect(page).toHaveURL(/category=/);
    }
  });

  test('search works', async ({ page }) => {
    // Use the shop page search input (inside aside), not the header search
    const searchInput = page.locator('aside').getByPlaceholder('Ürün ara...');
    await searchInput.fill('Forma');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/search=Forma/);
  });

  test('clicking product card navigates to detail', async ({ page }) => {
    const firstProduct = page.locator('a[href*="/tr/shop/"]').first();
    await firstProduct.click();
    await expect(page).toHaveURL(/\/tr\/shop\/.+/);
  });

  test('empty search shows no results message', async ({ page }) => {
    const searchInput = page.locator('aside').getByPlaceholder('Ürün ara...');
    await searchInput.fill('xyznonexistent999');
    await searchInput.press('Enter');
    await expect(page.getByText('Ürün Bulunamadı')).toBeVisible();
  });
});
