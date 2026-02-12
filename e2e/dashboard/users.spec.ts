import { test, expect } from '@playwright/test';
import { URLS } from '../helpers/test-data';

test.describe('Dashboard Users', () => {
  test('users page loads with table', async ({ page }) => {
    await page.goto(URLS.users);

    await expect(page.getByRole('heading', { name: /Kullanıcılar|Kullanicilar/ })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });
});
