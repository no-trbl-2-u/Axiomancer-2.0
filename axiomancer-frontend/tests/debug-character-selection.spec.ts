import { test, expect } from '@playwright/test';

test.describe('Character Selection Debug', () => {
  test('should debug character selection errors', async ({ page }) => {
    test.setTimeout(120000);

    // Capture console errors
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`CONSOLE ERROR: ${msg.text()}`);
        console.log(`❌ Console Error: ${msg.text()}`);
      }
    });

    page.on('requestfailed', request => {
      networkErrors.push(`NETWORK ERROR: ${request.url()} - ${request.failure()?.errorText}`);
      console.log(`🌐 Network Error: ${request.url()} - ${request.failure()?.errorText}`);
    });

    console.log('🔍 Starting character selection debug...');

    // Navigate to the app
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    console.log('📍 Step 1: Getting to character selection screen');

    // Click start
    await page.locator('text=Click to Start').click();
    await page.waitForTimeout(2000);

    // Register with unique email
    const uniqueEmail = `debug${Date.now()}@test.com`;

    const signUpButton = page.locator('text=Sign Up').first();
    if (await signUpButton.isVisible()) {
      await signUpButton.click();
    }

    await page.fill('input[name="firstName"]', 'Debug');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', 'debug123');

    await page.getByRole('button', { name: /sign up|register|create account/i }).click();
    console.log('✅ Registration submitted');

    await page.waitForTimeout(3000);

    // Check for errors after registration
    if (consoleErrors.length > 0) {
      console.log('⚠️ Errors found after registration:');
      consoleErrors.forEach(error => console.log(error));
    }

    // Try to create character
    console.log('📍 Step 2: Attempting character creation');

    const createButton = page.locator('button:has-text("Create")').first();
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(2000);
    }

    // Fill character form
    await page.fill('input#name', 'DebugChar');
    await page.selectOption('select#gender', 'female');

    // Allocate stats
    const bodyButton = page.locator('[data-testid="body-increase"]').first();
    if (await bodyButton.isVisible()) {
      for (let i = 0; i < 5; i++) {
        await bodyButton.click();
        await page.waitForTimeout(100);
      }
    }

    console.log('📍 Step 3: Attempting to begin journey');

    // Check if button is enabled/disabled and why
    const journeyButton = page.getByRole('button', { name: /begin.*journey/i });
    const isEnabled = await journeyButton.isEnabled();
    const buttonText = await journeyButton.textContent();

    console.log(`🔍 Journey button status: Enabled=${isEnabled}, Text="${buttonText}"`);

    if (!isEnabled) {
      console.log('❌ Journey button is disabled - checking form validation');

      // Check what might be missing
      const nameValue = await page.inputValue('input#name');
      const genderValue = await page.inputValue('select#gender');
      const portraitValue = await page.inputValue('select#portrait');

      console.log(`📝 Form values: Name="${nameValue}", Gender="${genderValue}", Portrait="${portraitValue}"`);

      // Check if portrait is required
      if (!portraitValue || portraitValue === '') {
        console.log('⚠️ Portrait might be required - selecting one');
        await page.selectOption('select#portrait', { index: 1 }); // Select first non-default option
        await page.waitForTimeout(500);

        const newIsEnabled = await journeyButton.isEnabled();
        console.log(`🔍 After selecting portrait: Enabled=${newIsEnabled}`);
      }
    }

    if (await journeyButton.isEnabled()) {
      await journeyButton.click();
      console.log('✅ Successfully clicked journey button');
      await page.waitForTimeout(3000);
    }

    console.log('📍 Step 4: Checking character selection screen');

    // Log out if we can
    const logoutButton = page.locator('button:has-text("Logout")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Logged out');

      // Log back in
      await page.fill('input[type="email"]', uniqueEmail);
      await page.fill('input[type="password"]', 'debug123');
      await page.getByRole('button', { name: /sign in|login/i }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Logged back in');
    }

    // Check for character selection screen errors
    await page.waitForTimeout(2000);

    // Look for the character or error messages
    const hasCharacter = await page.locator('text=DebugChar').isVisible();
    const hasCreateButton = await page.locator('button:has-text("Create")').isVisible();

    console.log(`🔍 Character selection: HasCharacter=${hasCharacter}, HasCreateButton=${hasCreateButton}`);

    // Take final screenshot
    await page.screenshot({ path: 'test-screenshots/character-selection-debug.png', fullPage: true });

    // Report all errors found
    console.log('\n📊 ERROR SUMMARY:');
    console.log(`Total console errors: ${consoleErrors.length}`);
    console.log(`Total network errors: ${networkErrors.length}`);

    if (consoleErrors.length > 0) {
      console.log('\n❌ CONSOLE ERRORS:');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (networkErrors.length > 0) {
      console.log('\n🌐 NETWORK ERRORS:');
      networkErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (consoleErrors.length === 0 && networkErrors.length === 0) {
      console.log('✅ No errors detected in character selection flow');
    }
  });
});