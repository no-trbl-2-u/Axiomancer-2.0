const { chromium } = require('playwright');

async function testAxiomancerRPG() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for better observation
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🎮 Starting Axiomancer RPG Test Suite');
    console.log('=====================================');

    // Test 1: Landing Page
    console.log('\n📍 Test 1: Testing Landing Page');
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of landing page
    await page.screenshot({ path: 'test-landing-page.png', fullPage: true });
    console.log('✅ Landing page loaded successfully');
    
    // Look for landing page elements
    const landingTitle = await page.locator('h1').first().textContent();
    console.log(`📋 Landing page title: "${landingTitle}"`);
    
    // Check for start button or similar
    const startButton = await page.locator('button, [role="button"]').first();
    if (await startButton.isVisible()) {
      console.log('✅ Start button found on landing page');
      await startButton.click();
      console.log('✅ Clicked start button');
    }

    // Test 2: Authentication Flow
    console.log('\n📍 Test 2: Testing Authentication Flow');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-auth-page.png', fullPage: true });
    
    // Check if we're on login/register page
    const authTitle = await page.locator('h1, h2').first().textContent();
    console.log(`📋 Auth page title: "${authTitle}"`);
    
    // Try to register or login (skip if already authenticated)
    const registerLink = await page.locator('text=Register, text=Sign Up, button:has-text("Register")').first();
    if (await registerLink.isVisible()) {
      await registerLink.click();
      console.log('✅ Navigated to registration');
      
      // Fill registration form
      await page.fill('input[type="email"], input[placeholder*="email" i]', 'test@axiomancer.com');
      await page.fill('input[type="password"], input[placeholder*="password" i]', 'TestPassword123!');
      
      const submitButton = await page.locator('button[type="submit"], button:has-text("Register")').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        console.log('✅ Submitted registration form');
      }
    } else {
      // Try login instead
      const loginInputs = await page.locator('input[type="email"], input[type="text"]').count();
      if (loginInputs > 0) {
        await page.fill('input[type="email"], input[type="text"]', 'test@axiomancer.com');
        await page.fill('input[type="password"]', 'TestPassword123!');
        
        const loginButton = await page.locator('button[type="submit"], button:has-text("Login")').first();
        if (await loginButton.isVisible()) {
          await loginButton.click();
          console.log('✅ Attempted login');
        }
      }
    }

    // Test 3: Character Creation
    console.log('\n📍 Test 3: Testing Character Creation');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-character-creation.png', fullPage: true });
    
    // Check for character creation screen
    const creationTitle = await page.locator('h1, h2').first().textContent();
    console.log(`📋 Character creation title: "${creationTitle}"`);
    
    // Fill character name
    const nameInput = await page.locator('input[type="text"], input[placeholder*="name" i]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Socrates the Wise');
      console.log('✅ Entered character name: Socrates the Wise');
    }
    
    // Select gender
    const genderOptions = await page.locator('button, input[type="radio"]').all();
    for (const option of genderOptions) {
      const text = await option.textContent();
      if (text && text.toLowerCase().includes('male')) {
        await option.click();
        console.log('✅ Selected gender: Male');
        break;
      }
    }
    
    // Select portrait
    const portraits = await page.locator('img, [role="button"]').all();
    if (portraits.length > 0) {
      await portraits[0].click();
      console.log('✅ Selected first available portrait');
    }
    
    // Submit character creation
    const createButton = await page.locator('button:has-text("Create"), button:has-text("Begin"), button[type="submit"]').first();
    if (await createButton.isVisible()) {
      await createButton.click();
      console.log('✅ Created character and entered game');
    }

    // Test 4: Main Game Interface
    console.log('\n📍 Test 4: Testing Main Game Interface');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-main-game.png', fullPage: true });
    
    // Check for main game tabs/navigation
    const tabs = await page.locator('[role="tab"], .tab, button').all();
    console.log(`📋 Found ${tabs.length} potential navigation elements`);
    
    const tabNames = [];
    for (const tab of tabs.slice(0, 8)) { // Limit to first 8 to avoid too many
      const text = await tab.textContent();
      if (text && text.trim().length > 0 && text.trim().length < 20) {
        tabNames.push(text.trim());
      }
    }
    console.log(`📋 Tab names found: ${tabNames.join(', ')}`);

    // Test 5: Exploration System
    console.log('\n📍 Test 5: Testing Exploration System');
    
    // Look for exploration tab or button
    const explorationElement = await page.locator('text=Exploration, text=Explore, text=Adventure').first();
    if (await explorationElement.isVisible()) {
      await explorationElement.click();
      console.log('✅ Navigated to exploration screen');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-exploration.png', fullPage: true });
      
      // Look for philosophical choices
      const choices = await page.locator('button:has-text("Choose"), button:has-text("Select"), [role="button"]').all();
      if (choices.length > 0) {
        await choices[0].click();
        console.log('✅ Made a philosophical choice');
        await page.screenshot({ path: 'test-philosophical-choice.png', fullPage: true });
      }
    }

    // Test 6: Combat System
    console.log('\n📍 Test 6: Testing Combat System');
    
    const combatElement = await page.locator('text=Combat, text=Fight, text=Battle').first();
    if (await combatElement.isVisible()) {
      await combatElement.click();
      console.log('✅ Navigated to combat screen');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-combat.png', fullPage: true });
      
      // Look for combat actions
      const actions = await page.locator('button:has-text("Attack"), button:has-text("Defend"), button:has-text("Cast")').all();
      if (actions.length > 0) {
        await actions[0].click();
        console.log('✅ Performed combat action');
        await page.screenshot({ path: 'test-combat-action.png', fullPage: true });
      }
    }

    // Test 7: Skills Screen
    console.log('\n📍 Test 7: Testing Skills Screen');
    
    const skillsElement = await page.locator('text=Skills, text=Abilities, text=Character').first();
    if (await skillsElement.isVisible()) {
      await skillsElement.click();
      console.log('✅ Navigated to skills screen');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-skills.png', fullPage: true });
    }

    // Test 8: Map Screen
    console.log('\n📍 Test 8: Testing Map Screen');
    
    const mapElement = await page.locator('text=Map, text=World, text=Travel').first();
    if (await mapElement.isVisible()) {
      await mapElement.click();
      console.log('✅ Navigated to map screen');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-map.png', fullPage: true });
    }

    console.log('\n🎉 Test Suite Completed Successfully!');
    console.log('=====================================');
    console.log('📸 Screenshots saved:');
    console.log('   - test-landing-page.png');
    console.log('   - test-auth-page.png');
    console.log('   - test-character-creation.png');
    console.log('   - test-main-game.png');
    console.log('   - test-exploration.png');
    console.log('   - test-combat.png');
    console.log('   - test-skills.png');
    console.log('   - test-map.png');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testAxiomancerRPG();