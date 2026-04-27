import { test, expect } from '@playwright/test';

const timestamp = Date.now();
const testEmail = `e2e_${timestamp}@test.com`;
const testPassword = 'TestPass123!';

test.describe('Authentication', () => {
  test('user can register', async ({ page }) => {
    await page.goto('/');
    
    // Click CTA Create Account to open register modal
    await page.click('button:has-text("Create Account")');
    await expect(page.locator('text=Get Started')).toBeVisible();
    
    // Fill registration form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.fill('input[placeholder="Your name"]', 'E2E Tester');
    
    // Click submit button inside modal form
    await page.locator('form button[type="submit"]').click();
    
    // Should redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.locator('text=Your Agents')).toBeVisible();
  });

  test('user can login and logout', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.click('button:has-text("Sign In")');
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.locator('form button[type="submit"]').click();
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.locator('text=Your Agents')).toBeVisible();
    
    // Logout
    await page.click('text=Logout');
    await page.waitForURL('**/');
    
    // Login again
    await page.click('button:has-text("Sign In")');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.locator('form button[type="submit"]').click();
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.locator('text=Your Agents')).toBeVisible();
  });
});
