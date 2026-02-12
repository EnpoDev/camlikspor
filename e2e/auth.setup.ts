import { test as setup, expect } from '@playwright/test';
import { URLS, CREDENTIALS } from './helpers/test-data';

setup('authenticate as dealer admin', async ({ page }) => {
  await page.goto(URLS.login, { waitUntil: 'networkidle' });

  await page.getByLabel('E-posta').fill(CREDENTIALS.dealerAdmin.email);
  await page.getByLabel('Sifre').fill(CREDENTIALS.dealerAdmin.password);
  await page.getByRole('button', { name: 'Giris Yap' }).click();

  await page.waitForURL(`**${URLS.dashboard}**`);

  await page.context().storageState({ path: 'e2e/.auth/dealer-admin.json' });
});
