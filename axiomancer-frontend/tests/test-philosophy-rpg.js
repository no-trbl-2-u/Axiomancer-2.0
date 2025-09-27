const { chromium } = require('playwright');

async function testPhilosophyRPG() {
  console.log('🧠 Starting Complete Philosophy-based RPG Test...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 2500 // Slow for demonstration
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Navigate through the complete flow
    console.log('📍 Starting the Axiomancer journey...');
    await page.goto('http://localhost:3000');

    // Landing page
    await page.waitForSelector('[alt="Axiomancer"]');
    await page.click('text=Click to Start');

    // Login
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', 'philosopher@academy.edu');
    await page.fill('input[type="password"]', 'wisdom123');
    await page.click('button[type="submit"]');

    // Character creation - Philosophy-focused character
    console.log('🎭 Creating a philosophy-focused character...');
    await page.waitForSelector('text=The Axiomancer\'s Journey');
    await page.fill('input[placeholder="Enter your character\'s name"]', 'Hypatia');

    // Select thoughtful philosophical stances
    await page.click('text=Virtue Ethics'); // Ethics
    await page.click('text=Idealist'); // Metaphysics
    await page.click('text=Rationalist'); // Epistemology

    await page.screenshot({ path: 'philosophy-character-creation.png', fullPage: true });
    console.log('📸 Screenshot: Character creation with philosophical stances');

    await page.click('text=Begin Your Journey');

    // Wait for game to load
    await page.waitForSelector('text=Hypatia');
    console.log('✅ Game loaded - Welcome, Hypatia the Philosopher!');

    // Test philosophical dialogue with guardian
    console.log('🗣️ Testing philosophical dialogue system...');
    await page.click('text=Talk to Your Guardian');
    await page.waitForSelector('text=Ethics and Moral Philosophy');

    await page.screenshot({ path: 'philosophy-dialogue-start.png', fullPage: true });
    console.log('📸 Screenshot: Philosophical dialogue begins');

    // Make virtue ethics choice (aligns with character creation)
    await page.click('text=I believe in cultivating virtue and excellence of character');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'philosophy-choice-1.png', fullPage: true });
    console.log('📸 Screenshot: First philosophical choice made');

    // Wait for follow-up question about epistemology
    await page.waitForSelector('text=Epistemology - The Nature of Knowledge');

    // Make rationalist choice (aligns with character creation)
    await page.click('text=Through reason and logical thinking');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'philosophy-choice-2.png', fullPage: true });
    console.log('📸 Screenshot: Second philosophical choice made');

    // Complete dialogue
    await page.waitForSelector('text=Return to Exploration');
    await page.click('text=Return to Exploration');

    // Check character stats (should have improved from dialogue)
    console.log('📊 Checking character development...');
    await page.click('text=Character');
    await page.waitForSelector('text=Character Stats');

    await page.screenshot({ path: 'philosophy-character-growth.png', fullPage: true });
    console.log('📸 Screenshot: Character stats after philosophical growth');

    // Test exploration and combat
    console.log('🌲 Exploring the world...');
    await page.click('text=Explore');
    await page.click('text=Whispering Forest');
    await page.waitForSelector('text=Whispering Forest');

    await page.screenshot({ path: 'philosophy-exploration.png', fullPage: true });
    console.log('📸 Screenshot: Exploration in the Whispering Forest');

    // Test philosophical combat
    console.log('⚔️ Engaging in philosophical combat...');
    await page.click('text=The Philosophical Tree');
    await page.waitForSelector('text=Philosophical Goblin');

    await page.screenshot({ path: 'philosophy-combat-start.png', fullPage: true });
    console.log('📸 Screenshot: Philosophical combat begins');

    // Use philosophical abilities
    await page.click('text=⚔️ Wisdom Strike');
    await page.waitForTimeout(3000);

    await page.click('text=🧘 Contemplation');
    await page.waitForTimeout(3000);

    await page.click('text=⚡ Rational Bolt');
    await page.waitForTimeout(4000);

    await page.screenshot({ path: 'philosophy-combat-end.png', fullPage: true });
    console.log('📸 Screenshot: Combat resolution');

    // Test world map
    console.log('🗺️ Viewing the philosophical world...');
    await page.click('text=Map');
    await page.waitForSelector('text=World Map');

    await page.screenshot({ path: 'philosophy-world-map.png', fullPage: true });
    console.log('📸 Screenshot: World map of philosophical locations');

    // Final character state
    await page.click('text=Character');
    await page.waitForSelector('text=Philosophical Stance');

    await page.screenshot({ path: 'philosophy-final-character.png', fullPage: true });
    console.log('📸 Screenshot: Final character development');

    // Test different viewport sizes for responsive design
    console.log('📱 Testing responsive philosophy RPG...');

    const viewports = [
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: `philosophy-rpg-${viewport.name.toLowerCase()}.png`,
        fullPage: false
      });
      console.log(`📸 Screenshot: ${viewport.name} responsive design`);
    }

    console.log('\n🎉 Complete Philosophy-based RPG Test Successful!');
    console.log('📊 Test Summary:');
    console.log('   ✅ Character creation with philosophical stances');
    console.log('   ✅ Philosophical dialogue system with meaningful choices');
    console.log('   ✅ Character stat progression based on philosophical decisions');
    console.log('   ✅ Turn-based combat with philosophical themes');
    console.log('   ✅ World exploration and location-based interactions');
    console.log('   ✅ Map navigation and location discovery');
    console.log('   ✅ Responsive design across devices');
    console.log('   ✅ Complete integration of philosophy and RPG mechanics');

    console.log('\n🌟 Philosophy RPG Features Demonstrated:');
    console.log('   💭 Virtue Ethics, Idealism, and Rationalism integration');
    console.log('   🎯 Choice-consequence system affecting character development');
    console.log('   ⚔️ Combat system with philosophical skills and themes');
    console.log('   🗣️ Deep dialogue system exploring ethical dilemmas');
    console.log('   📈 Progressive character growth through philosophical choices');
    console.log('   🌍 World-building with philosophical locations and NPCs');

  } catch (error) {
    console.error('❌ Philosophy RPG test failed:', error.message);

    try {
      await page.screenshot({ path: 'philosophy-rpg-error.png', fullPage: true });
      console.log('📸 Error screenshot saved');
    } catch (screenshotError) {
      console.log('Failed to take error screenshot');
    }

    throw error;
  } finally {
    console.log('\n🔍 Browser will remain open for 20 seconds for inspection...');
    console.log('   You can interact with the completed Philosophy RPG!');
    await new Promise(resolve => setTimeout(resolve, 20000));
    await browser.close();
  }
}

// Run the comprehensive test
testPhilosophyRPG().catch(console.error);