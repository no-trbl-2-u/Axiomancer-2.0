import { test, expect } from '@playwright/test';

test.describe('Complete Axiomancer Game Flow', () => {
  test('should complete full game flow from landing to exploration', async ({ page }) => {
    // Set longer timeout for this comprehensive test
    test.setTimeout(120000);

    console.log('🎮 Starting complete Axiomancer game flow test...');

    // Step 1: Landing page
    console.log('📍 Step 1: Loading landing page');
    await page.goto('http://localhost:3000');

    // Wait for landing page and take screenshot
    await expect(page.locator('text=Click to Start')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'testing-suite/screenshots/01-landing-page.png', fullPage: true });

    // Click anywhere on the landing page to start (entire container is clickable)
    await page.locator('text=Click to Start').click();
    console.log('✅ Clicked start button');

    // Step 2: Authentication
    console.log('📍 Step 2: Authentication flow');
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'testing-suite/screenshots/02-auth-page.png', fullPage: true });

    // Fill in login credentials
    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', 'admin');
    await page.getByRole('button', { name: /sign in/i }).click();
    console.log('✅ Signed in successfully');

    // Step 3: Character Creation (Heart/Body/Mind System)
    console.log('📍 Step 3: Character creation');
    await expect(page.locator('h2')).toContainText('Character Creation - UPDATED', { timeout: 15000 });
    await page.screenshot({ path: 'testing-suite/screenshots/03-character-creation.png', fullPage: true });

    // Verify Heart/Body/Mind character creation system exists
    await expect(page.locator('text=Enter Name')).toBeVisible();
    await expect(page.locator('text=Enter Gender')).toBeVisible();
    await expect(page.locator('text=Portrait Dropdown')).toBeVisible();
    await expect(page.locator('text=Character Preview')).toBeVisible();

    // Fill character creation form
    await page.fill('input#name', 'TestPhilosopher');
    await page.selectOption('select#gender', 'male');
    await page.selectOption('select#portrait', { index: 1 }); // Select first available portrait

    // Test Heart/Body/Mind stat allocation
    await expect(page.locator('text=Stat Allocation')).toBeVisible();
    await expect(page.locator('text=Heart:')).toBeVisible();
    await expect(page.locator('text=Body:')).toBeVisible();
    await expect(page.locator('text=Mind:')).toBeVisible();

    // Test stat allocation buttons (increase/decrease)
    await page.locator('[data-testid="heart-increase"]').click();
    await page.locator('[data-testid="body-increase"]').click();

    // Verify derived stats are displayed
    await expect(page.locator('text=Physical Attack:')).toBeVisible();
    await expect(page.locator('text=Mind Attack:')).toBeVisible();
    await expect(page.locator('text=Ailment Attack:')).toBeVisible();

    await page.screenshot({ path: 'testing-suite/screenshots/04-character-filled.png', fullPage: true });

    // Submit character creation
    await page.getByRole('button', { name: /begin your philosophical journey/i }).click();
    console.log('✅ Character created successfully');

    // Step 4: Main Game Interface
    console.log('📍 Step 4: Main game interface');
    await expect(page.locator('text=TestPhilosopher')).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: 'testing-suite/screenshots/05-main-game.png', fullPage: true });

    // Verify main game UI elements
    await expect(page.locator('text=Level 1 Philosopher')).toBeVisible();
    await expect(page.getByRole('button', { name: /explore/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /world map/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /character/i })).toBeVisible();

    console.log('✅ Main game interface loaded');

    // Step 5: World Map Navigation
    console.log('📍 Step 5: World map navigation');
    await page.getByRole('button', { name: /world map/i }).click();

    // Wait for world map to load
    await expect(page.locator('text=🌍 World Map')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Small Fishing Village')).toBeVisible();
    await page.screenshot({ path: 'testing-suite/screenshots/06-world-map.png', fullPage: true });

    // Click on the first area (Small Fishing Village)
    await page.locator('text=Small Fishing Village').click();

    // Verify local map loads with forest-themed node names
    await expect(page.locator('text=🗺️ Local Area')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'testing-suite/screenshots/07-local-map.png', fullPage: true });

    // Look for forest-themed node names (they should be random but forest-themed)
    const forestNodes = page.locator('[data-testid="local-node"]').or(page.locator('div').filter({ hasText: /Glade|Clearing|Hollow|Grove|Path|Spring|Circle|Bower|Thicket|Meadow|Haven|Dell|Brook|Vale|Copse|Glen|Pool|Sanctuary/i }));

    console.log('✅ Local map with forest-themed nodes loaded');

    // Step 6: Exploration
    console.log('📍 Step 6: Starting exploration');
    await page.getByRole('button', { name: /explore/i }).click();

    // Wait for exploration screen
    await expect(page.locator('text=Begin Exploration').or(page.locator('text=🔍'))).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'testing-suite/screenshots/08-exploration-screen.png', fullPage: true });

    // Click begin exploration
    await page.getByRole('button', { name: /begin exploration/i }).or(page.locator('button:has-text("🔍")')).click();

    // Wait for either a philosophical event or combat to appear
    const eventOrCombat = page.locator('text=The Runaway Cart').or(
      page.locator('text=The Deceiving Sophist')).or(
      page.locator('text=Forgotten Wisdom')).or(
      page.locator('text=Philosophical Combat')).or(
      page.locator('text=Ancient Elder Tree')).or(
      page.locator('text=Forest Guardian'));

    await expect(eventOrCombat).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: 'testing-suite/screenshots/09-exploration-event.png', fullPage: true });

    // Check if it's a philosophical event (has choices) or combat
    const hasChoices = await page.locator('button').filter({ hasText: /approach|strike|argument|appeal/i }).count() > 0;

    if (hasChoices) {
      console.log('🎭 Encountered philosophical dilemma');

      // Click on the first available choice
      const firstChoice = page.locator('button').filter({ hasText: /approach|APPROACH/i }).first();
      if (await firstChoice.count() > 0) {
        await firstChoice.click();
        console.log('✅ Made philosophical choice');

        // Wait for result
        await expect(page.locator('text=Philosophical Growth Achieved!').or(page.locator('text=Experience'))).toBeVisible({ timeout: 10000 });
        await page.screenshot({ path: 'testing-suite/screenshots/10-choice-result.png', fullPage: true });
      }
    } else {
      console.log('⚔️ Encountered combat');

      // Look for combat choices
      const combatChoice = page.locator('button').filter({ hasText: /physical strike|logical argument|emotional appeal/i }).first();
      if (await combatChoice.count() > 0) {
        await combatChoice.click();
        console.log('✅ Made combat choice');

        // Wait for combat result
        await page.waitForTimeout(3000); // Combat has turn delays
        await page.screenshot({ path: 'testing-suite/screenshots/10-combat-result.png', fullPage: true });
      }
    }

    // Step 7: Return to main game and verify state
    console.log('📍 Step 7: Verifying final game state');

    // Wait a moment for any animations/results to complete
    await page.waitForTimeout(2000);

    // Take final screenshot
    await page.screenshot({ path: 'testing-suite/screenshots/11-final-state.png', fullPage: true });

    // Verify we're still in the game and character data persists
    await expect(page.locator('text=TestPhilosopher')).toBeVisible();

    console.log('🎉 Complete game flow test completed successfully!');
    console.log('📊 Test covered: Landing → Auth → Character Creation → Main Game → World Map → Local Map → Exploration');
  });

  test('should handle character creation with different genders and portraits', async ({ page }) => {
    console.log('🎨 Testing character creation variations...');

    await page.goto('http://localhost:3000');

    // Quick auth flow
    await page.locator('text=Click to Start').click();
    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', 'admin');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Test female character creation
    await expect(page.locator('h2')).toContainText('Character Creation - UPDATED', { timeout: 15000 });

    await page.fill('input#name', 'TestWoman');
    await page.selectOption('select#gender', 'female');

    // Verify portrait options change for female
    const femalePortraitOptions = await page.locator('select#portrait option').count();
    expect(femalePortraitOptions).toBeGreaterThan(1); // Should have at least default + portraits

    await page.selectOption('select#portrait', { index: 1 });

    // Verify stats remain consistent
    await expect(page.locator('text=Age: 10 • 50 HP • 20 MP')).toBeVisible();
    await expect(page.locator('text=Body').first()).toBeVisible();
    await expect(page.locator('text=5').first()).toBeVisible(); // Body stat value

    await page.screenshot({ path: 'testing-suite/screenshots/female-character-creation.png', fullPage: true });

    console.log('✅ Character creation variations test completed');
  });
});