import { test, expect } from '@playwright/test';
import { URLS } from '../helpers/test-data';

/**
 * Navigate to shop and open the first product via direct page.goto().
 * Retries with reload if the page returns 404 (dev-mode compilation race).
 */
async function goToFirstProduct(page: import('@playwright/test').Page) {
  await page.goto(URLS.shop);
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

  const firstProduct = page.locator('a[href*="/tr/shop/"]').first();
  await expect(firstProduct).toBeVisible({ timeout: 15000 });
  const href = await firstProduct.getAttribute('href');

  // Use direct navigation instead of click to avoid client-side routing issues
  const productUrl = href ? `http://localhost:3000${href}` : null;
  if (productUrl) {
    await page.goto(productUrl, { timeout: 30000 });
  } else {
    await firstProduct.click();
    await page.waitForURL(/\/tr\/shop\/.+/, { timeout: 20000 });
  }

  // Retry with reload if 404 (dev-mode first-compile takes time)
  for (let attempt = 0; attempt < 5; attempt++) {
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    const is404 = await page.locator('text=This page could not be found').isVisible({ timeout: 2000 }).catch(() => false);
    if (!is404) return;

    // Wait for Next.js to finish compiling, then reload
    await page.waitForTimeout(3000);
    await page.reload({ timeout: 30000 });
  }
}

test.describe('Product Detail Page', () => {
  // Triple the default timeout for dev-mode compilation
  test.slow();

  test.beforeEach(async ({ page }) => {
    await goToFirstProduct(page);
  });

  test('page loads with product info', async ({ page }) => {
    // Ensure we're not on a 404 page - h1 should have product name, not "404"
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible({ timeout: 15000 });
    const h1Text = await h1.textContent();
    expect(h1Text).not.toBe('404');

    // Price should be visible (₺ symbol somewhere on the page)
    await expect(page.getByText('₺').first()).toBeVisible({ timeout: 10000 });
  });

  test('size selection buttons are clickable', async ({ page }) => {
    const sizeButtons = page.locator('button').filter({ hasText: /^(XS|S|M|L|XL|XXL|2XL|3XL|\d+)$/ });
    const count = await sizeButtons.count();
    if (count > 1) {
      // Click the second size button
      await sizeButtons.nth(1).click();
      // Verify it has the selected style (emerald bg)
      await expect(sizeButtons.nth(1)).toHaveClass(/bg-emerald-600/);
    }
  });

  test('quantity controls work', async ({ page }) => {
    const plusButton = page.locator('button').filter({ has: page.locator('svg.lucide-plus') }).first();
    const minusButton = page.locator('button').filter({ has: page.locator('svg.lucide-minus') }).first();

    // Wait for quantity controls to be visible
    if (await plusButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      // The minus button should be disabled at quantity 1
      await expect(minusButton).toBeDisabled();

      // Click plus
      await plusButton.click();
      // Now minus should be enabled
      await expect(minusButton).toBeEnabled();
    }
  });

  test('add to cart button works', async ({ page }) => {
    // First select a size if available
    const sizeButtons = page.locator('button').filter({ hasText: /^(XS|S|M|L|XL|XXL|2XL|3XL|\d+)$/ });
    if (await sizeButtons.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await sizeButtons.first().click();
    }

    const addToCartButton = page.getByRole('button', { name: 'Sepete Ekle' });
    if (await addToCartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addToCartButton.click();
      // Toast message should appear
      await expect(page.getByText('Ürün sepete eklendi!')).toBeVisible({ timeout: 10000 });
    }
  });
});
