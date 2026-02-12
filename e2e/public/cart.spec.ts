import { test, expect } from '@playwright/test';
import { URLS, CART_STORAGE_KEY } from '../helpers/test-data';

function makeCartState(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    dealerSlug: null,
    items: [
      {
        productId: 'test-product-1',
        variantId: 'test-variant-1',
        name: 'Test Forma',
        price: 250,
        quantity: 2,
        size: 'M',
        image: null,
        ...overrides,
      },
    ],
  });
}

async function setCart(page: import('@playwright/test').Page, cartJson: string) {
  await page.goto(URLS.shop, { waitUntil: 'networkidle' });
  await page.evaluate(
    ({ key, data }) => localStorage.setItem(key, data),
    { key: CART_STORAGE_KEY, data: cartJson }
  );
  await page.goto(URLS.cart, { waitUntil: 'networkidle' });
}

test.describe('Cart Page', () => {
  test('empty cart shows message', async ({ page }) => {
    await page.goto(URLS.cart, { waitUntil: 'networkidle' });
    await expect(page.getByText('Sepetiniz Boş')).toBeVisible();
    await expect(page.locator('a').filter({ hasText: /Alışverişe Başla/ })).toBeVisible();
  });

  test('cart with items shows product info', async ({ page }) => {
    await setCart(page, makeCartState());
    await expect(page.getByText('Test Forma')).toBeVisible();
    await expect(page.getByText('Beden: M')).toBeVisible();
  });

  test('quantity buttons update total', async ({ page }) => {
    await setCart(page, makeCartState({ price: 100, quantity: 1 }));

    const plusButton = page.locator('button').filter({ has: page.locator('svg.lucide-plus') }).first();
    await plusButton.click();

    await expect(page.getByText('2', { exact: true }).first()).toBeVisible();
  });

  test('remove item button works', async ({ page }) => {
    await setCart(page, makeCartState({ price: 100, quantity: 1 }));

    const trashButton = page.locator('button').filter({ has: page.locator('svg.lucide-trash-2') }).first();
    await trashButton.click();

    await expect(page.getByText('Sepetiniz Boş')).toBeVisible();
  });

  test('checkout button navigates to checkout', async ({ page }) => {
    await setCart(page, makeCartState({ price: 100, quantity: 1 }));

    await page.getByRole('button', { name: /Ödemeye Geç/ }).click();
    await expect(page).toHaveURL(/\/tr\/checkout/, { timeout: 15000 });
  });
});
