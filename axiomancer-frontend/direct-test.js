const { chromium } = require('playwright');

async function testDirectNavigation() {
  console.log('🚀 Starting direct navigation test...');

  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  try {
    // Load the page
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    console.log('📄 Page loaded');

    // Take screenshot of landing page
    await page.screenshot({ path: 'direct-test-landing.png' });
    console.log('📸 Landing page screenshot taken');

    // Try different methods to click the start button
    console.log('🔍 Looking for clickable elements...');

    // Method 1: Click the actual clickable element (the image or div)
    try {
      // Look for any clickable element in the center area
      const clickableArea = await page.locator('img, div, span').filter({ hasText: 'CLICK TO START' }).first();
      if (await clickableArea.isVisible().catch(() => false)) {
        console.log('✅ Found CLICK TO START element, clicking...');
        await clickableArea.click();
        await page.waitForTimeout(3000);
      } else {
        // Try clicking on the center of the page where the button should be
        console.log('🎯 Clicking center of page...');
        await page.click('body', { position: { x: 640, y: 360 } });
        await page.waitForTimeout(3000);
      }
    } catch (error) {
      console.log('❌ Click method 1 failed:', error.message);
    }

    // Take screenshot after clicking
    await page.screenshot({ path: 'direct-test-after-click.png' });
    console.log('📸 After click screenshot taken');

    // Check if URL changed
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // If still on landing page, try other methods
    if (currentUrl === 'http://localhost:3002/') {
      console.log('🔄 Still on landing page, trying alternative methods...');

      // Method 2: Look for any links or buttons
      const links = await page.locator('a').count();
      const buttons = await page.locator('button').count();

      console.log(`Found ${links} links and ${buttons} buttons`);

      if (buttons > 0) {
        await page.locator('button').first().click();
        await page.waitForTimeout(3000);
      } else if (links > 0) {
        await page.locator('a').first().click();
        await page.waitForTimeout(3000);
      }

      // Method 3: Try pressing Enter or Space
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      await page.keyboard.press('Space');
      await page.waitForTimeout(1000);
    }

    // Final screenshot and URL check
    await page.screenshot({ path: 'direct-test-final.png' });
    const finalUrl = page.url();
    console.log(`📍 Final URL: ${finalUrl}`);

    // Check the page content to understand what we're looking at
    const pageTitle = await page.title();
    const bodyText = await page.locator('body').textContent();

    console.log(`📄 Page title: ${pageTitle}`);
    console.log(`📝 Page contains: ${bodyText.substring(0, 200)}...`);

    // If we made it past the landing page, test the game interface
    if (finalUrl !== 'http://localhost:3002/') {
      console.log('🎮 Testing game interface...');

      // Look for game elements
      const gameElements = await page.locator('[class*="Node"], [class*="Map"], [class*="Game"]').count();
      console.log(`🎯 Found ${gameElements} potential game elements`);

      if (gameElements > 0) {
        await page.screenshot({ path: 'direct-test-game-interface.png' });
        console.log('📸 Game interface screenshot taken');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDirectNavigation();