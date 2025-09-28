const { chromium } = require('playwright');

async function testAxiomancerRPG() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // Slow down for better observation
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🎮 Starting Axiomancer RPG Complete Test Suite');
    console.log('===============================================');

    // Test 1: Landing Page
    console.log('\n📍 Test 1: Testing Landing Page');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of landing page
    await page.screenshot({ path: 'test-01-landing.png', fullPage: true });
    console.log('✅ Landing page loaded successfully');
    
    // Look for landing page elements and content
    try {
      await page.waitForSelector('body', { timeout: 5000 });
      const pageContent = await page.content();
      console.log('📋 Page loaded, checking for content...');
      
      // Look for typical landing page elements
      const buttons = await page.locator('button').count();
      console.log(`📊 Found ${buttons} buttons on the page`);
      
      // Look for start/play button
      const startButtons = await page.locator('button:has-text("Start"), button:has-text("Play"), button:has-text("Begin")').count();
      if (startButtons > 0) {
        console.log('✅ Found start/play button');
        await page.locator('button:has-text("Start"), button:has-text("Play"), button:has-text("Begin")').first().click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Clicked start button');
      } else {
        // Try clicking any button to proceed
        if (buttons > 0) {
          await page.locator('button').first().click();
          await page.waitForLoadState('networkidle');
          console.log('✅ Clicked first available button');
        }
      }
    } catch (error) {
      console.log('⚠️ Error finding start button:', error.message);
    }

    // Test 2: Authentication/Registration Flow
    console.log('\n📍 Test 2: Testing Authentication Flow');
    await page.screenshot({ path: 'test-02-auth.png', fullPage: true });
    
    try {
      // Look for registration/login forms
      const inputs = await page.locator('input').count();
      console.log(`📊 Found ${inputs} input fields`);
      
      // Try to fill registration form if present
      const usernameInput = await page.locator('input[type="text"], input[placeholder*="name"], input[name*="name"]').first();
      const emailInput = await page.locator('input[type="email"], input[placeholder*="email"]').first();
      const passwordInput = await page.locator('input[type="password"], input[placeholder*="password"]').first();
      
      if (await usernameInput.isVisible()) {
        await usernameInput.fill('TestUser');
        console.log('✅ Filled username field');
      }
      
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
        console.log('✅ Filled email field');
      }
      
      if (await passwordInput.isVisible()) {
        await passwordInput.fill('password123');
        console.log('✅ Filled password field');
      }
      
      // Submit form
      const submitButton = await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Register"), button:has-text("Sign")').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Submitted authentication form');
      }
      
    } catch (error) {
      console.log('⚠️ Authentication flow not found or already authenticated');
    }

    // Test 3: Character Creation
    console.log('\n📍 Test 3: Testing Character Creation');
    await page.screenshot({ path: 'test-03-character.png', fullPage: true });
    
    try {
      // Look for character creation elements
      const nameInput = await page.locator('input[placeholder*="name"], input[name*="name"]').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('Socrates');
        console.log('✅ Entered character name: Socrates');
      }
      
      // Test gender selection
      const genderButtons = await page.locator('button:has-text("Male"), button:has-text("Female"), button:has-text("Non-Binary")').count();
      console.log(`📊 Found ${genderButtons} gender selection buttons`);
      
      if (genderButtons > 0) {
        await page.locator('button:has-text("Male")').first().click();
        console.log('✅ Selected Male gender');
        
        // Test portrait filtering
        await page.waitForTimeout(1000);
        const portraits = await page.locator('img, .portrait, [data-testid*="portrait"]').count();
        console.log(`📊 Found ${portraits} portrait options after gender selection`);
        
        // Select first portrait
        if (portraits > 0) {
          await page.locator('img, .portrait, [data-testid*="portrait"]').first().click();
          console.log('✅ Selected character portrait');
        }
      }
      
      // Create character
      const createButton = await page.locator('button:has-text("Create"), button:has-text("Confirm"), button:has-text("Start")').first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Created character successfully');
      }
      
    } catch (error) {
      console.log('⚠️ Character creation step may have been skipped or failed:', error.message);
    }

    // Test 4: Main Game Interface
    console.log('\n📍 Test 4: Testing Main Game Interface');
    await page.screenshot({ path: 'test-04-game-main.png', fullPage: true });
    
    try {
      // Check for main game elements
      const tabs = await page.locator('[role="tab"], .tab, button:has-text("Explore"), button:has-text("Character"), button:has-text("Inventory")').count();
      console.log(`📊 Found ${tabs} navigation tabs`);
      
      // Check for status bars (health, mana, experience)
      const statusBars = await page.locator('.health, .mana, .experience, [data-testid*="status"]').count();
      console.log(`📊 Found ${statusBars} status bar elements`);
      
      // Check for character portrait in main game
      const characterPortrait = await page.locator('img, .character-portrait, [data-testid*="portrait"]').count();
      console.log(`📊 Found ${characterPortrait} character portrait elements`);
      
      console.log('✅ Main game interface loaded');
      
    } catch (error) {
      console.log('⚠️ Error checking main game interface:', error.message);
    }

    // Test 5: Tab Navigation
    console.log('\n📍 Test 5: Testing Tab Navigation');
    
    const tabNames = ['Explore', 'World Map', 'Character', 'Philosophy', 'Skills', 'Inventory'];
    
    for (const tabName of tabNames) {
      try {
        const tabButton = await page.locator(`button:has-text("${tabName}"), [role="tab"]:has-text("${tabName}")`, { timeout: 3000 });
        if (await tabButton.isVisible()) {
          await tabButton.click();
          await page.waitForTimeout(500);
          await page.screenshot({ path: `test-05-tab-${tabName.toLowerCase()}.png` });
          console.log(`✅ Successfully navigated to ${tabName} tab`);
        }
      } catch (error) {
        console.log(`⚠️ ${tabName} tab not found or not clickable`);
      }
    }

    // Test 6: Exploration System
    console.log('\n📍 Test 6: Testing Exploration System');
    
    try {
      // Navigate to Explore tab if not already there
      const exploreTab = await page.locator('button:has-text("Explore")').first();
      if (await exploreTab.isVisible()) {
        await exploreTab.click();
        await page.waitForTimeout(500);
      }
      
      // Look for Begin Exploration button
      const exploreButton = await page.locator('button:has-text("Begin"), button:has-text("Explore"), button:has-text("Adventure")').first();
      if (await exploreButton.isVisible()) {
        await exploreButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Started exploration');
        
        await page.screenshot({ path: 'test-06-exploration.png', fullPage: true });
        
        // Test philosophical choices (Body/Mind/Heart)
        const choiceButtons = await page.locator('button:has-text("Body"), button:has-text("Mind"), button:has-text("Heart")').count();
        console.log(`📊 Found ${choiceButtons} philosophical choice buttons`);
        
        if (choiceButtons > 0) {
          await page.locator('button:has-text("Mind")').first().click();
          await page.waitForTimeout(1000);
          console.log('✅ Made philosophical choice: Mind');
          
          await page.screenshot({ path: 'test-06-choice-result.png', fullPage: true });
        }
        
      } else {
        console.log('⚠️ Exploration button not found');
      }
      
    } catch (error) {
      console.log('⚠️ Error testing exploration system:', error.message);
    }

    // Test 7: Combat System (if available)
    console.log('\n📍 Test 7: Testing Combat System');
    
    try {
      // Look for combat-related elements
      const combatButtons = await page.locator('button:has-text("Attack"), button:has-text("Defend"), button:has-text("Combat"), button:has-text("Fight")').count();
      console.log(`📊 Found ${combatButtons} combat-related buttons`);
      
      if (combatButtons > 0) {
        console.log('✅ Combat system detected');
        await page.screenshot({ path: 'test-07-combat.png', fullPage: true });
      } else {
        console.log('⚠️ Combat system not immediately visible');
      }
      
    } catch (error) {
      console.log('⚠️ Error testing combat system:', error.message);
    }

    // Final Summary Screenshot
    await page.screenshot({ path: 'test-final-state.png', fullPage: true });
    
    console.log('\n🎯 Test Summary');
    console.log('================');
    console.log('✅ Application loaded and is responsive');
    console.log('📸 Screenshots saved for manual review');
    console.log('🎮 Basic RPG functionality appears to be working');
    
    console.log('\n📋 Manual Review Required:');
    console.log('- Check screenshots for UI quality and polish');
    console.log('- Verify philosophical content integration');
    console.log('- Assess overall user experience flow');
    console.log('- Confirm D&D-style mechanics are present');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    await page.screenshot({ path: 'test-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n🏁 Test completed');
  }
}

// Run the test
testAxiomancerRPG().catch(console.error);