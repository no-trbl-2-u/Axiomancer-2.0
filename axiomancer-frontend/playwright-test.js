const { chromium } = require('playwright');

(async () => {
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false, // Set to true if you want to run without UI
    slowMo: 500 // Slow down operations by 500ms for better visibility
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('Step 1: Opening localhost:3000...');
    // 1) Open "localhost:3000" to LandingPage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('Step 2: Clicking anywhere on screen...');
    // 2) Click anywhere on screen
    await page.click('body');
    await page.waitForTimeout(1000);
    
    console.log('Step 3: Taking screenshot of Login Page...');
    // 3) Take Screenshot of Login Page
    await page.screenshot({
      path: 'Screenshots/01-login-page.png',
      fullPage: true
    });
    
    console.log('Step 4: Entering email...');
    // 4) Enter text in "Email" input --> admin@admin.com
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="mail" i]', 'admin@admin.com');
    
    console.log('Step 5: Entering password...');
    // 5) Enter password in "password" input --> admin
    await page.fill('input[type="password"], input[name="password"]', 'admin');
    
    console.log('Step 6: Clicking Sign In...');
    // 6) Click "Sign In"
    await page.click('button:has-text("Sign In"), button:has-text("Login"), button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('Step 7: Taking screenshot of Character Creation Screen...');
    // 7) Take Screenshot of Character Creation Screen
    await page.screenshot({
      path: 'Screenshots/02-character-creation.png',
      fullPage: true
    });
    
    console.log('Step 8: Clicking Continue Journey...');
    // 8) Click "Continue Journey"
    await page.click('button:has-text("Continue Journey"), button:has-text("Continue")');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('Step 9: Taking screenshot of main Game Interface...');
    // 9) Take Screenshot of main Game Interface
    await page.screenshot({
      path: 'Screenshots/03-game-interface.png',
      fullPage: true
    });
    
    console.log('Step 10: Clicking Character Tab...');
    // 10) Click "Character" Tab
    await page.click('button:has-text("Character"), [role="tab"]:has-text("Character"), div:has-text("Character")');
    await page.waitForTimeout(1500);
    
    console.log('Step 11: Taking screenshot of Character Screen...');
    // 11) Take screenshot of Character Screen
    await page.screenshot({
      path: 'Screenshots/04-character-screen.png',
      fullPage: true
    });
    
    console.log('Step 12: Scrolling to bottom and clicking Skills Tab...');
    // 12) Scroll to bottom of page and click "Skills Tab"
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.click('button:has-text("Skills"), [role="tab"]:has-text("Skills"), div:has-text("Skills")');
    await page.waitForTimeout(1500);
    
    console.log('Step 13: Scrolling to top and taking screenshot...');
    // 13) Scroll to top of page and Take a Screenshot
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'Screenshots/05-skills-tab.png',
      fullPage: true
    });
    
    console.log('Step 14: Clicking Save...');
    // 14) Click "Save"
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(1500);
    
    console.log('Step 15: Clicking Inventory tab...');
    // 15) Click "Inventory" tab at bottom of the screen
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.click('button:has-text("Inventory"), [role="tab"]:has-text("Inventory"), div:has-text("Inventory")');
    await page.waitForTimeout(1500);
    
    console.log('Step 16: Taking screenshot of Inventory Page...');
    // 16) Take Screenshot of Inventory Page
    await page.screenshot({
      path: 'Screenshots/06-inventory-page.png',
      fullPage: true
    });
    
    console.log('Step 17: Clicking Map Tab...');
    // 17) Click Map Tab at bottom of page
    await page.click('button:has-text("Map"), [role="tab"]:has-text("Map"), div:has-text("Map")');
    await page.waitForTimeout(1500);
    
    console.log('Taking final screenshot of Map...');
    await page.screenshot({
      path: 'Screenshots/07-map-page.png',
      fullPage: true
    });
    
    console.log('✅ All steps completed successfully!');
    console.log('Screenshots saved to ./Screenshots/ directory');
    
  } catch (error) {
    console.error('❌ Error occurred:', error.message);
    await page.screenshot({
      path: 'Screenshots/error-screenshot.png',
      fullPage: true
    });
  } finally {
    // Keep browser open for 3 seconds before closing
    await page.waitForTimeout(3000);
    await browser.close();
  }
})();

