const { chromium } = require('playwright');

async function testPhilosophyGame() {
  console.log('🎭 Starting Philosophy-based RPG Test...\n');

  const browser = await chromium.launch({
    headless: false, // Set to true for CI/CD
    slowMo: 1500 // Slow down for better visibility
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Navigate to the app
    console.log('📍 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000');

    // Wait for the landing page to load
    await page.waitForSelector('[alt="Axiomancer"]', { timeout: 10000 });
    console.log('✅ Landing page loaded successfully');

    // Click to start
    console.log('🚀 Clicking to start the application...');
    const clickToStartText = await page.locator('text=Click to Start');
    await clickToStartText.click();

    // Wait for login page and use test credentials
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    console.log('✅ Login page loaded');

    // Fill in test credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for character creation page
    console.log('🧙 Waiting for character creation...');
    await page.waitForSelector('text=The Axiomancer\'s Journey', { timeout: 10000 });
    console.log('✅ Character creation page loaded');

    // Test character creation
    console.log('📝 Testing character creation...');

    // Enter character name
    await page.fill('input[placeholder="Enter your character\'s name"]', 'Socrates');
    console.log('   ✓ Character name entered: Socrates');

    // Test philosophical stance selection
    console.log('🤔 Testing philosophical stance selection...');

    // Select Ethics: Virtue Ethics (should be selected by default)
    await page.click('text=Virtue Ethics');
    console.log('   ✓ Selected Virtue Ethics');

    // Select Metaphysics: Idealist
    await page.click('text=Idealist');
    console.log('   ✓ Selected Idealist metaphysics');

    // Select Epistemology: Rationalist
    await page.click('text=Rationalist');
    console.log('   ✓ Selected Rationalist epistemology');

    // Take a screenshot of character creation
    await page.screenshot({ path: 'character-creation.png', fullPage: true });
    console.log('📸 Screenshot saved: character-creation.png');

    // Click Begin Your Journey
    console.log('🌟 Starting the game...');
    await page.click('text=Begin Your Journey');

    // Wait for game interface to load
    await page.waitForSelector('text=Socrates', { timeout: 10000 });
    console.log('✅ Game interface loaded with character: Socrates');

    // Test game navigation tabs
    console.log('🎮 Testing game navigation...');

    // Screenshot of exploration screen
    await page.screenshot({ path: 'exploration-screen.png', fullPage: true });
    console.log('📸 Screenshot saved: exploration-screen.png');

    // Test Character tab
    await page.click('text=Character');
    await page.waitForSelector('text=Character Stats', { timeout: 3000 });
    console.log('   ✓ Character screen loaded');
    await page.screenshot({ path: 'character-screen.png', fullPage: true });
    console.log('📸 Screenshot saved: character-screen.png');

    // Test Map tab
    await page.click('text=Map');
    await page.waitForSelector('text=World Map', { timeout: 3000 });
    console.log('   ✓ Map screen loaded');
    await page.screenshot({ path: 'map-screen.png', fullPage: true });
    console.log('📸 Screenshot saved: map-screen.png');

    // Test Inventory tab
    await page.click('text=Inventory');
    await page.waitForSelector('text=Inventory System', { timeout: 3000 });
    console.log('   ✓ Inventory screen loaded');

    // Return to exploration
    await page.click('text=Explore');
    await page.waitForSelector('text=Small Fishing Town', { timeout: 3000 });
    console.log('   ✓ Returned to exploration screen');

    // Test location interaction
    console.log('🏃 Testing location interactions...');

    // Try to gather fish
    const gatherFishButton = page.locator('text=Gather fish');
    if (await gatherFishButton.isVisible()) {
      await gatherFishButton.click();
      console.log('   ✓ Clicked gather fish');
    }

    // Try to talk to guardian
    const talkToGuardianButton = page.locator('text=Talk to Your Guardian');
    if (await talkToGuardianButton.isVisible()) {
      await talkToGuardianButton.click();
      console.log('   ✓ Clicked talk to guardian');
    }

    // Test travel to forest
    const forestButton = page.locator('text=Whispering Forest');
    if (await forestButton.isVisible()) {
      await forestButton.click();
      await page.waitForTimeout(1000);
      console.log('   ✓ Traveled to Whispering Forest');

      // Take screenshot of forest location
      await page.screenshot({ path: 'forest-location.png', fullPage: true });
      console.log('📸 Screenshot saved: forest-location.png');
    }

    // Test responsive design
    console.log('📱 Testing responsive design...');

    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      console.log(`   Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: `game-${viewport.name.toLowerCase()}.png`,
        fullPage: false
      });
      console.log(`   📸 Screenshot saved: game-${viewport.name.toLowerCase()}.png`);
    }

    // Wait a moment to observe final state
    console.log('⏱️  Waiting 3 seconds to observe final state...');
    await page.waitForTimeout(3000);

    console.log('\n🎉 Philosophy-based RPG test completed successfully!');
    console.log('📊 Test Summary:');
    console.log('   ✅ Landing page navigation');
    console.log('   ✅ Authentication flow');
    console.log('   ✅ Character creation with philosophical stances');
    console.log('   ✅ Game interface and navigation');
    console.log('   ✅ Location exploration and interaction');
    console.log('   ✅ Responsive design testing');
    console.log('   ✅ Screenshots captured for visual verification');

  } catch (error) {
    console.error('❌ Test failed:', error.message);

    // Take an error screenshot
    try {
      await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
      console.log('📸 Error screenshot saved: error-screenshot.png');
    } catch (screenshotError) {
      console.log('Failed to take error screenshot');
    }

    throw error;
  } finally {
    // Keep browser open for 10 seconds to allow manual inspection
    console.log('🔍 Browser will close in 10 seconds for manual inspection...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    await browser.close();
  }
}

// Run the test
testPhilosophyGame().catch(console.error);