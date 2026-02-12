import { test, expect } from '@playwright/test';
import { URLS } from '../helpers/test-data';

test.describe('Dashboard Groups', () => {
  test('groups page loads with table', async ({ page }) => {
    await page.goto(URLS.groups);

    await expect(page.getByRole('heading', { name: /Gruplar/ })).toBeVisible();
    // Check for either a table or a "no data" message
    const table = page.locator('table');
    const noData = page.getByText(/kayıt|Veri bulunamadı/);
    await expect(table.or(noData).first()).toBeVisible();
  });

  test('new group button navigates correctly', async ({ page }) => {
    await page.goto(URLS.groups);

    // Button is inside <Link><Button>, use locator instead of getByRole('link')
    await page.locator('a[href*="/groups/new"]').click();
    await expect(page).toHaveURL(/\/tr\/groups\/new/);
  });
});
