import { test, expect } from "@playwright/test";
import { URLS, CREDENTIALS } from "../helpers/test-data";

// Login tests don't use storageState — they test the login form itself
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Parent Login", () => {
  test("login page loads with correct elements", async ({ page }) => {
    await page.goto(URLS.parentLogin, { waitUntil: "networkidle" });

    await expect(page.getByText("Hos Geldiniz")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Giris Yap/i })
    ).toBeVisible();
  });

  test("shows heading and panel label", async ({ page }) => {
    await page.goto(URLS.parentLogin, { waitUntil: "networkidle" });

    await expect(page.getByText("Veli hesabiniza giris yapin")).toBeVisible();
  });

  test("shows validation error for empty email", async ({ page }) => {
    await page.goto(URLS.parentLogin, { waitUntil: "networkidle" });

    // Submit with empty fields to trigger client-side validation
    await page.getByRole("button", { name: /Giris Yap/i }).click();

    await expect(
      page.getByText("Gecerli bir e-posta adresi giriniz")
    ).toBeVisible();
  });

  test("shows validation error for empty password", async ({ page }) => {
    await page.goto(URLS.parentLogin, { waitUntil: "networkidle" });

    await page.locator("#email").fill("test@example.com");
    await page.getByRole("button", { name: /Giris Yap/i }).click();

    await expect(page.getByText("Sifre gereklidir")).toBeVisible();
  });

  test("shows error toast for invalid credentials", async ({ page }) => {
    await page.goto(URLS.parentLogin, { waitUntil: "networkidle" });

    await page.locator("#email").fill(CREDENTIALS.parent.email);
    await page.locator("#password").fill("WrongPassword123!");
    await page.getByRole("button", { name: /Giris Yap/i }).click();

    await expect(
      page.getByText("Gecersiz e-posta veya sifre")
    ).toBeVisible({ timeout: 10000 });
  });

  test("successful login redirects to parent panel", async ({ page }) => {
    await page.goto(URLS.parentLogin, { waitUntil: "networkidle" });

    await page.locator("#email").fill(CREDENTIALS.parent.email);
    await page.locator("#password").fill(CREDENTIALS.parent.password);
    await page.getByRole("button", { name: /Giris Yap/i }).click();

    await expect(page).toHaveURL(/\/parent\/parent/, { timeout: 15000 });
  });

  test("protected parent route redirects to parent login", async ({
    page,
  }) => {
    await page.goto(URLS.parentDashboard);

    await expect(page).toHaveURL(/\/parent-login/);
  });
});
