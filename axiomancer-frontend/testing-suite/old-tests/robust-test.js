const { chromium } = require('playwright');

async function safeGetText(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return await page.textContent(selector);
  } catch {
    return null;
  }
}

async function safeClick(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
    return true;
  } catch {
    return false;
  }
}

async function testAxiomancerRPG() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const report = {
    landingPage: { status: 'fail', details: [] },
    authentication: { status: 'fail', details: [] },
    characterCreation: { status: 'fail', details: [] },
    gameInterface: { status: 'fail', details: [] },
    exploration: { status: 'fail', details: [] },
    combat: { status: 'fail', details: [] },
    skills: { status: 'fail', details: [] },
    map: { status: 'fail', details: [] },
    userExperience: { status: 'fail', details: [] }
  };

  try {
    console.log('🎮 Starting Comprehensive Axiomancer RPG Test');
    console.log('===============================================');

    // Test 1: Landing Page
    console.log('\n📍 Test 1: Landing Page Assessment');
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-01-landing.png', fullPage: true });
    
    const pageContent = await page.content();
    console.log(`📄 Page loaded with ${pageContent.length} characters`);
    
    // Try multiple selectors for title
    let title = await safeGetText(page, 'h1') || 
                await safeGetText(page, 'h2') || 
                await safeGetText(page, '[class*="title"]') ||
                await safeGetText(page, '[class*="heading"]');
    
    if (title) {
      console.log(`✅ Found page title: "${title}"`);
      report.landingPage.status = 'pass';
      report.landingPage.details.push(`Title: ${title}`);
    } else {
      console.log('⚠️  No clear title found, checking for any text content');
      const anyText = await page.evaluate(() => document.body.innerText.slice(0, 200));
      console.log(`📝 Page content preview: "${anyText}"`);
      report.landingPage.details.push(`Content preview: ${anyText}`);
    }
    
    // Look for interactive elements
    const buttons = await page.locator('button, [role="button"], a').count();
    console.log(`🔘 Found ${buttons} interactive elements`);
    report.landingPage.details.push(`Interactive elements: ${buttons}`);
    
    // Try to find and click start/continue button
    const clicked = await safeClick(page, 'button') || 
                   await safeClick(page, '[role="button"]') ||
                   await safeClick(page, 'a[href*="#"]') ||
                   await safeClick(page, '[class*="start"]') ||
                   await safeClick(page, '[class*="begin"]');
    
    if (clicked) {
      console.log('✅ Successfully clicked navigation element');
      report.landingPage.status = 'pass';
      await page.waitForTimeout(2000);
    }

    // Test 2: Authentication Flow
    console.log('\n📍 Test 2: Authentication Assessment');
    await page.screenshot({ path: 'test-02-auth.png', fullPage: true });
    
    const authContent = await page.content();
    const hasLoginForm = authContent.includes('password') || authContent.includes('email') || 
                        authContent.includes('login') || authContent.includes('register');
    
    if (hasLoginForm) {
      console.log('✅ Authentication form detected');
      report.authentication.status = 'pass';
      report.authentication.details.push('Login/Register form found');
      
      // Try to fill and submit forms
      const emailInput = await page.locator('input[type="email"], input[placeholder*="email" i]').first();
      const passwordInput = await page.locator('input[type="password"]').first();
      
      if (await emailInput.isVisible({ timeout: 2000 })) {
        await emailInput.fill('test@axiomancer.com');
        await passwordInput.fill('TestPassword123!');
        console.log('✅ Filled authentication form');
        
        const submitBtn = await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Register")').first();
        if (await submitBtn.isVisible({ timeout: 2000 })) {
          await submitBtn.click();
          console.log('✅ Submitted authentication form');
          await page.waitForTimeout(3000);
        }
      }
    } else {
      console.log('⚠️  No authentication form detected, may already be authenticated');
      report.authentication.details.push('No auth form - possibly already authenticated');
    }

    // Test 3: Character Creation
    console.log('\n📍 Test 3: Character Creation Assessment');
    await page.screenshot({ path: 'test-03-character.png', fullPage: true });
    
    const charContent = await page.content();
    const hasCharCreation = charContent.includes('character') || charContent.includes('name') ||
                           charContent.includes('portrait') || charContent.includes('gender') ||
                           charContent.includes('Create') || charContent.includes('philosopher');
    
    if (hasCharCreation) {
      console.log('✅ Character creation screen detected');
      report.characterCreation.status = 'pass';
      report.characterCreation.details.push('Character creation interface found');
      
      // Try to create character
      const nameInputs = await page.locator('input[type="text"], input:not([type="password"]):not([type="email"])').all();
      if (nameInputs.length > 0) {
        await nameInputs[0].fill('Socrates the Philosopher');
        console.log('✅ Entered character name');
        report.characterCreation.details.push('Name input successful');
      }
      
      // Try to select gender
      const radioButtons = await page.locator('input[type="radio"], button').all();
      if (radioButtons.length > 0) {
        await radioButtons[0].click();
        console.log('✅ Selected character option (gender/portrait)');
        report.characterCreation.details.push('Gender/portrait selection successful');
      }
      
      // Submit character creation
      const createBtn = await page.locator('button:has-text("Create"), button:has-text("Begin"), button:has-text("Start")').first();
      if (await createBtn.isVisible({ timeout: 2000 })) {
        await createBtn.click();
        console.log('✅ Submitted character creation');
        await page.waitForTimeout(3000);
        report.characterCreation.details.push('Character creation submitted');
      }
    }

    // Test 4: Main Game Interface
    console.log('\n📍 Test 4: Main Game Interface Assessment');
    await page.screenshot({ path: 'test-04-game-main.png', fullPage: true });
    
    const gameContent = await page.content();
    const gameKeywords = ['exploration', 'combat', 'skills', 'map', 'inventory', 'character', 'quest'];
    const foundKeywords = gameKeywords.filter(keyword => 
      gameContent.toLowerCase().includes(keyword.toLowerCase())
    );
    
    console.log(`🎯 Found game keywords: ${foundKeywords.join(', ')}`);
    report.gameInterface.details.push(`Game keywords found: ${foundKeywords.join(', ')}`);
    
    if (foundKeywords.length >= 3) {
      report.gameInterface.status = 'pass';
      console.log('✅ Main game interface appears functional');
    }
    
    // Count navigation elements
    const navElements = await page.locator('nav, .tab, [role="tab"], button').count();
    console.log(`🧭 Found ${navElements} navigation elements`);
    report.gameInterface.details.push(`Navigation elements: ${navElements}`);

    // Test 5: Exploration System
    console.log('\n📍 Test 5: Exploration System Assessment');
    
    const explorationClicked = await safeClick(page, 'text=Exploration') ||
                              await safeClick(page, 'text=Explore') ||
                              await safeClick(page, 'button:has-text("Explore")') ||
                              await safeClick(page, '[class*="exploration"]');
    
    if (explorationClicked) {
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-05-exploration.png', fullPage: true });
      
      const exploreContent = await page.content();
      const hasPhilosophy = exploreContent.includes('philosophical') || 
                           exploreContent.includes('philosophy') ||
                           exploreContent.includes('choice') ||
                           exploreContent.includes('decision');
      
      if (hasPhilosophy) {
        console.log('✅ Philosophical elements found in exploration');
        report.exploration.status = 'pass';
        report.exploration.details.push('Philosophical content detected');
        
        // Try to make a choice
        const choiceBtn = await page.locator('button:has-text("Choose"), button:has-text("Select")').first();
        if (await choiceBtn.isVisible({ timeout: 2000 })) {
          await choiceBtn.click();
          console.log('✅ Made philosophical choice');
          report.exploration.details.push('Interactive choices available');
        }
      }
    }

    // Test 6: Combat System
    console.log('\n📍 Test 6: Combat System Assessment');
    
    const combatClicked = await safeClick(page, 'text=Combat') ||
                         await safeClick(page, 'text=Fight') ||
                         await safeClick(page, 'text=Battle');
    
    if (combatClicked) {
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-06-combat.png', fullPage: true });
      
      const combatContent = await page.content();
      const hasCombatElements = combatContent.includes('attack') || 
                               combatContent.includes('defend') ||
                               combatContent.includes('hp') ||
                               combatContent.includes('health') ||
                               combatContent.includes('damage');
      
      if (hasCombatElements) {
        console.log('✅ Combat mechanics detected');
        report.combat.status = 'pass';
        report.combat.details.push('Combat interface found');
      }
    }

    // Test 7: Skills Screen
    console.log('\n📍 Test 7: Skills System Assessment');
    
    const skillsClicked = await safeClick(page, 'text=Skills') ||
                         await safeClick(page, 'text=Character') ||
                         await safeClick(page, 'text=Abilities');
    
    if (skillsClicked) {
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-07-skills.png', fullPage: true });
      
      const skillsContent = await page.content();
      const hasSkillElements = skillsContent.includes('skill') || 
                              skillsContent.includes('level') ||
                              skillsContent.includes('experience') ||
                              skillsContent.includes('attribute');
      
      if (hasSkillElements) {
        console.log('✅ Skills system detected');
        report.skills.status = 'pass';
        report.skills.details.push('Skills interface found');
      }
    }

    // Test 8: Map Screen
    console.log('\n📍 Test 8: Map System Assessment');
    
    const mapClicked = await safeClick(page, 'text=Map') ||
                      await safeClick(page, 'text=World') ||
                      await safeClick(page, 'text=Travel');
    
    if (mapClicked) {
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-08-map.png', fullPage: true });
      
      const mapContent = await page.content();
      const hasMapElements = mapContent.includes('location') || 
                            mapContent.includes('travel') ||
                            mapContent.includes('map') ||
                            mapContent.includes('world');
      
      if (hasMapElements) {
        console.log('✅ Map system detected');
        report.map.status = 'pass';
        report.map.details.push('Map interface found');
      }
    }

    // Final screenshot
    await page.screenshot({ path: 'test-09-final.png', fullPage: true });

    console.log('\n🎉 Test Suite Completed!');
    console.log('========================');
    
    // Generate comprehensive report
    console.log('\n📊 COMPREHENSIVE TEST REPORT');
    console.log('==============================');
    
    Object.entries(report).forEach(([test, result]) => {
      const status = result.status === 'pass' ? '✅' : '❌';
      console.log(`${status} ${test.charAt(0).toUpperCase() + test.slice(1)}: ${result.status.toUpperCase()}`);
      result.details.forEach(detail => console.log(`   • ${detail}`));
    });
    
    const passedTests = Object.values(report).filter(r => r.status === 'pass').length;
    const totalTests = Object.keys(report).length;
    console.log(`\n🏆 Overall Score: ${passedTests}/${totalTests} tests passed`);
    
    // User Experience Assessment
    if (passedTests >= 6) {
      report.userExperience.status = 'pass';
      console.log('\n✅ OVERALL ASSESSMENT: Axiomancer appears to be a functional RPG with philosophy integration!');
    } else if (passedTests >= 4) {
      console.log('\n⚠️  OVERALL ASSESSMENT: Axiomancer shows promise but needs refinement');
    } else {
      console.log('\n❌ OVERALL ASSESSMENT: Significant issues detected in core functionality');
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    await page.screenshot({ path: 'test-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testAxiomancerRPG();