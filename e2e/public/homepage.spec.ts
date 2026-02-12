import { test, expect } from '@playwright/test';
import { URLS } from '../helpers/test-data';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.home);
  });

  test('hero section is visible', async ({ page }) => {
    const hero = page.locator('h1');
    await expect(hero).toBeVisible();

    // CTA buttons are <Link><Button> so use text-based locators
    await expect(page.getByText('Kayıt Ol', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Hakkımızda').first()).toBeVisible();
  });

  test('features section shows 4 cards', async ({ page }) => {
    // Features cards are h3 elements in the features section
    const featureCards = page.locator('h3');
    await expect(featureCards.filter({ hasText: 'Profesyonel Eğitmenler' })).toBeVisible();
    await expect(featureCards.filter({ hasText: 'Modern Tesisler' })).toBeVisible();
    await expect(featureCards.filter({ hasText: 'Yaş Grupları' })).toBeVisible();
    await expect(featureCards.filter({ hasText: 'Esnek Saatler' })).toBeVisible();
  });

  test('shop preview section is visible', async ({ page }) => {
    await expect(page.getByText('Kulüp Ürünleri')).toBeVisible();
  });

  test('contact section is visible', async ({ page }) => {
    const contact = page.locator('#contact');
    await expect(contact).toBeVisible();
    await expect(page.getByText('Bize Ulaşın')).toBeVisible();
  });

  test('header navigation to shop works', async ({ page }) => {
    await page.locator('nav a').filter({ hasText: 'Mağaza' }).first().click();
    await expect(page).toHaveURL(/\/tr\/shop/);
  });
});
