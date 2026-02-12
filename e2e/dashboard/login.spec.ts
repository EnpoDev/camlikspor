import { test, expect } from '@playwright/test';
import { URLS, CREDENTIALS } from '../helpers/test-data';

// Login tests don't use storageState — they test the login form itself
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login Page', () => {
  test('login page loads', async ({ page }) => {
    await page.goto(URLS.login, { waitUntil: 'networkidle' });
    await expect(page.getByText('Hos Geldiniz')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('invalid credentials show error', async ({ page }) => {
    await page.goto(URLS.login, { waitUntil: 'networkidle' });
    await page.locator('#email').fill(CREDENTIALS.dealerAdmin.email);
    await page.locator('#password').fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Giris Yap' }).click();

    await expect(page.getByText('Gecersiz e-posta veya sifre')).toBeVisible();
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto(URLS.login, { waitUntil: 'networkidle' });
    await page.locator('#email').fill(CREDENTIALS.dealerAdmin.email);
    await page.locator('#password').fill(CREDENTIALS.dealerAdmin.password);
    await page.getByRole('button', { name: 'Giris Yap' }).click();

    await expect(page).toHaveURL(/\/tr\/dashboard/, { timeout: 15000 });
  });

  test('protected route redirects to login', async ({ page }) => {
    await page.goto(URLS.products);
    await expect(page).toHaveURL(/\/tr\/login/);
  });
});
