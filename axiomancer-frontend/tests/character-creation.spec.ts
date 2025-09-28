import { test, expect } from '@playwright/test';

test.describe('Character Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
  });

  test('should display character creation screen', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Create Your Philosopher');
    await expect(page.locator('input[id="character-name"]')).toBeVisible();
    await expect(page.locator('text=Male')).toBeVisible();
    await expect(page.locator('text=Female')).toBeVisible();
    await expect(page.locator('text=Non-Binary')).toBeVisible();
  });

  test('should create character with name and portrait', async ({ page }) => {
    // Enter character name
    await page.fill('input[id="character-name"]', 'Socrates');

    // Select gender (male by default)
    await page.click('text=Male');

    // Select a portrait (should auto-select first available)
    await expect(page.locator('img[alt*="Young Seeker"]')).toBeVisible();

    // Click create button
    await page.click('text=Begin Your Philosophical Journey');

    // Should navigate away from character creation
    await expect(page.locator('h1')).not.toContainText('Create Your Philosopher');
  });

  test('should filter portraits by gender', async ({ page }) => {
    // Start with male selected
    await expect(page.locator('img[alt*="Young Seeker"]')).toBeVisible();
    await expect(page.locator('img[alt*="Wise Guardian"]')).toBeVisible();

    // Switch to female
    await page.click('text=Female');

    // Should only show non-binary options when no female-specific portraits exist
    await expect(page.locator('img[alt*="Wandering Philosopher"]')).toBeVisible();

    // Switch to non-binary
    await page.click('text=Non-Binary');
    await expect(page.locator('img[alt*="Wandering Philosopher"]')).toBeVisible();
  });

  test('should require name to create character', async ({ page }) => {
    // Don't enter a name
    await page.click('text=Male');

    // Create button should be disabled
    await expect(page.locator('text=Begin Your Philosophical Journey')).toBeDisabled();

    // Enter name
    await page.fill('input[id="character-name"]', 'Aristotle');

    // Create button should be enabled
    await expect(page.locator('text=Begin Your Philosophical Journey')).toBeEnabled();
  });
});