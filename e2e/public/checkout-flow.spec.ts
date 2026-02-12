import { test, expect } from '@playwright/test';
import { URLS } from '../helpers/test-data';

test.describe('Checkout Flow', () => {
  test('full E2E checkout flow', async ({ page }) => {
    // Triple timeout for dev-mode compilation
    test.slow();

    // 1. Go to shop and get first product href
    await page.goto(URLS.shop);
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

    const firstProduct = page.locator('a[href*="/tr/shop/"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });
    const href = await firstProduct.getAttribute('href');

    // Navigate directly to product page
    if (href) {
      await page.goto(`http://localhost:3000${href}`, { timeout: 30000 });
    } else {
      await firstProduct.click();
      await page.waitForURL(/\/tr\/shop\/.+/, { timeout: 20000 });
    }

    // Retry with reload if 404 (dev-mode first-compile takes time)
    for (let attempt = 0; attempt < 5; attempt++) {
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
      const is404 = await page.locator('text=This page could not be found').isVisible({ timeout: 2000 }).catch(() => false);
      if (!is404) break;

      await page.waitForTimeout(3000);
      await page.reload({ timeout: 30000 });
    }

    // Wait for product page to be fully loaded
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    // 2. Select size (first available) and add to cart
    const sizeButton = page.locator('button').filter({ hasText: /^(XS|S|M|L|XL|XXL|2XL|3XL|\d+)$/ }).first();
    if (await sizeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await sizeButton.click();
    }

    // Wait for the page to fully load, then click add-to-cart
    const addToCartButton = page.getByRole('button', { name: 'Sepete Ekle' });
    await expect(addToCartButton).toBeVisible({ timeout: 15000 });
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
    await expect(page.getByText('Ürün sepete eklendi!')).toBeVisible({ timeout: 10000 });

    // 3. Navigate to cart and proceed to checkout
    await page.goto(URLS.cart);
    await page.getByRole('button', { name: /Ödemeye Geç/ }).click();
    await page.waitForURL(/\/tr\/checkout/, { timeout: 15000 });

    // 4. Fill checkout form
    await page.locator('#customerName').fill('Test Kullanici');
    await page.locator('#customerEmail').fill('test@example.com');
    await page.locator('#customerPhone').fill('05551234567');

    // 5. Submit order
    await page.getByRole('button', { name: /Siparişi Tamamla/ }).click();

    // 6. Verify success page (use toHaveURL — router.push is a soft navigation)
    await expect(page).toHaveURL(/\/tr\/checkout\/success/, { timeout: 30000 });
    await expect(page.getByText('Tebrikler!')).toBeVisible();
    await expect(page.getByText(/ORD-/)).toBeVisible();
  });

  test('empty cart redirects to shop', async ({ page }) => {
    await page.goto(URLS.checkout);
    await expect(page).toHaveURL(/\/tr\/shop/, { timeout: 15000 });
  });
});
