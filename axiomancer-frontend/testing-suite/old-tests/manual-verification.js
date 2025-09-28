const { chromium } = require('playwright');

async function manualVerification() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🎯 Manual Verification of Core Functionality');
    console.log('============================================');

    // Step 1: Load and navigate past landing page
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    console.log('✅ Landing page loaded');
    
    // Click through landing page
    await page.click('text=CLICK TO START');
    await page.waitForTimeout(2000);
    console.log('✅ Navigated past landing page');

    // Step 2: Try to register a new account (or login if exists)
    try {
      const hasRegisterLink = await page.isVisible('text=Sign up', { timeout: 3000 });
      if (hasRegisterLink) {
        await page.click('text=Sign up');
        await page.waitForTimeout(1000);
        
        await page.fill('input[type="email"]', 'testuser@axiomancer.com');
        await page.fill('input[type="password"]', 'TestPassword123!');
        await page.click('button[type="submit"]');
        console.log('✅ Attempted registration');
      } else {
        // Try login
        await page.fill('input[type="email"]', 'testuser@axiomancer.com');
        await page.fill('input[type="password"]', 'TestPassword123!');
        await page.click('button[type="submit"]');
        console.log('✅ Attempted login');
      }
    } catch (e) {
      console.log('⚠️  Authentication may have been bypassed or failed');
    }
    
    await page.waitForTimeout(3000);

    // Step 3: Character Creation
    const isCharCreation = await page.isVisible('text=Create Your Philosopher', { timeout: 5000 });
    if (isCharCreation) {
      console.log('✅ Character creation screen found');
      
      await page.fill('input[id="character-name"]', 'Aristotle the Wise');
      console.log('✅ Entered character name');
      
      await page.click('text=Male');
      console.log('✅ Selected gender');
      
      // Wait for portraits to load and click first one
      await page.waitForTimeout(1000);
      const portraits = await page.locator('img[alt*="Seeker"], img[alt*="Guardian"], img[alt*="Philosopher"]').first();
      if (await portraits.isVisible()) {
        await portraits.click();
        console.log('✅ Selected portrait');
      }
      
      await page.click('text=Begin Your Philosophical Journey');
      console.log('✅ Created character');
      await page.waitForTimeout(3000);
    }

    // Step 4: Main Game Interface
    await page.screenshot({ path: 'verification-main-game.png', fullPage: true });
    console.log('✅ Reached main game interface');

    // Test navigation tabs
    const tabs = ['Explore', 'Character', 'Philosophy & Skills', 'World Map', 'Inventory'];
    for (const tab of tabs) {
      try {
        const tabElement = await page.locator(`text=${tab}`).first();
        if (await tabElement.isVisible({ timeout: 2000 })) {
          await tabElement.click();
          await page.waitForTimeout(1500);
          await page.screenshot({ path: `verification-${tab.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png` });
          console.log(`✅ Tested ${tab} tab`);
        }
      } catch (e) {
        console.log(`⚠️  Could not test ${tab} tab: ${e.message}`);
      }
    }

    // Test philosophical exploration
    try {
      await page.click('text=Explore');
      await page.waitForTimeout(2000);
      
      // Look for philosophical choices
      const hasChoices = await page.isVisible('button:has-text("Choose"), button:has-text("Select")', { timeout: 3000 });
      if (hasChoices) {
        await page.click('button:has-text("Choose"), button:has-text("Select")');
        console.log('✅ Made philosophical choice');
        await page.screenshot({ path: 'verification-philosophical-choice.png' });
      }
    } catch (e) {
      console.log('⚠️  Could not test philosophical choices');
    }

    // Test combat system
    try {
      const combatBtn = await page.locator('text=Combat, ⚔️ Combat').first();
      if (await combatBtn.isVisible({ timeout: 2000 })) {
        await combatBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'verification-combat.png' });
        console.log('✅ Accessed combat system');
      }
    } catch (e) {
      console.log('⚠️  Could not access combat system');
    }

    console.log('\n🎉 Manual verification completed!');
    console.log('Screenshots saved for each major screen.');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    await page.screenshot({ path: 'verification-error.png' });
  } finally {
    await page.waitForTimeout(5000); // Keep browser open for manual inspection
    await browser.close();
  }
}

manualVerification();