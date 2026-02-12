import { test, expect } from '@playwright/test';
import { URLS } from '../helpers/test-data';

test.describe('Dashboard Orders', () => {
  test('orders page loads', async ({ page }) => {
    await page.goto(URLS.orders);

    await expect(page.getByRole('heading', { name: /Sipari/ })).toBeVisible();
    // Check for either a table or a "no data" message
    const table = page.locator('table');
    const noData = page.getByText(/Veri bulunamadı/);
    await expect(table.or(noData).first()).toBeVisible();
  });
});
