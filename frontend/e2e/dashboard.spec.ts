import { test, expect } from '@playwright/test';

const timestamp = Date.now();
const testEmail = `dash_${timestamp}@test.com`;
const testPassword = 'TestPass123!';

async function registerUser(page, email: string, password: string) {
  await page.goto('/');
  await page.click('button:has-text("Create Account")');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.fill('input[placeholder="Your name"]', 'Dashboard Tester');
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await registerUser(page, testEmail, testPassword);
  });

  test('dashboard shows lobster logo in navbar', async ({ page }) => {
    const navLogo = page.locator('nav svg[viewBox="0 0 120 120"]');
    await expect(navLogo).toBeVisible();
  });

  test('can navigate to billing page', async ({ page }) => {
    await page.click('text=Billing');
    await expect(page.locator('text=Choose Your Plan')).toBeVisible();
  });

  test('can navigate to API keys page', async ({ page }) => {
    await page.click('text=API Keys');
    await expect(page.locator('text=API Keys')).toBeVisible();
  });

  test('can create an agent', async ({ page }) => {
    await page.click('text=New Agent');
    await page.fill('input[name="name"]', 'Test Agent');
    await page.selectOption('select[name="type"]', 'openclaw');
    await page.click('button[type="submit"]');
    
    // Should redirect back to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.locator('text=Test Agent')).toBeVisible();
  });
});
