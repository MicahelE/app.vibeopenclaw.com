import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('loads with OpenClaw logo', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/VibeOpenClaw/);
    const logo = page.locator('svg[viewBox="0 0 120 120"]').first();
    await expect(logo).toBeVisible();
  });

  test('shows pricing cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h3:has-text("Pro")')).toBeVisible();
    await expect(page.locator('h3:has-text("Premium")')).toBeVisible();
    // Use exact text for prices to avoid matching button text
    await expect(page.getByText('$60', { exact: true })).toBeVisible();
    await expect(page.getByText('$100', { exact: true })).toBeVisible();
  });

  test('auth modal opens in sign-in mode', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Sign In")');
    await expect(page.locator('text=Welcome Back')).toBeVisible();
  });
});
