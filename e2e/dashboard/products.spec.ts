import { test, expect } from '@playwright/test';
import { URLS } from '../helpers/test-data';

test.describe('Dashboard Products', () => {
  test('products page loads with table', async ({ page }) => {
    await page.goto(URLS.products);

    await expect(page.getByRole('heading', { name: /Ürünler/ })).toBeVisible();
    await expect(page.locator('table').first()).toBeVisible();
  });

  test('new product button navigates correctly', async ({ page }) => {
    await page.goto(URLS.products);

    // Button is inside <Link><Button>, use href locator
    await page.locator('a[href*="/products/new"]').click();
    await expect(page).toHaveURL(/\/tr\/products\/new/);
  });
});
