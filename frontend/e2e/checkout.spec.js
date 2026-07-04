import { test, expect } from '@playwright/test';

// Full customer happy path against a real backend running with
// SPRING_PROFILES_ACTIVE=e2e (FakeDarajaClient + seeded product — see
// backend's E2eDataSeeder / DarajaClientImpl's "!e2e" profile guard).
test('register, browse, add to cart, checkout, and initiate payment', async ({ page }) => {
  const unique = Date.now();
  const email = `e2e-${unique}@example.com`;
  const password = 'password123';

  await page.goto('/signup');
  await page.fill('#username', `e2e${unique}`);
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type=submit]');
  await page.waitForURL('**/signin');

  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type=submit]');
  await page.waitForURL('http://localhost:5173/');

  await page.goto('/menu');
  await page.waitForSelector('text=E2E Product');
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.waitForSelector('text=Added to cart');

  await page.goto('/cart');
  await expect(page.getByText('E2E Product')).toBeVisible();
  await page.getByRole('link', { name: 'Checkout' }).click();
  await page.waitForURL('**/checkout');

  await page.fill('#firstname', 'Playwright');
  await page.fill('#lastname', 'Tester');
  await page.fill('#address', '123 Test Street');
  await page.selectOption('#region', 'Nairobi');
  await page.selectOption('#city', 'Utawala');
  await page.click('button:has-text("Save & continue")');

  await page.waitForURL('**/payment/*', { timeout: 15000 });

  await page.fill('#phone', '712345678');
  await page.click('button:has-text("Pay")');

  await expect(page.getByText('Check your phone and enter your M-Pesa PIN')).toBeVisible({ timeout: 15000 });
});
