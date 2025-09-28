const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('1. Navigating to application...');
  await page.goto('http://localhost:3000');

  // Take screenshot of landing page
  await page.screenshot({ path: 'landing-page.png' });
  console.log('✓ Landing page loaded');

  // Click to start (assuming there's a button to get past landing)
  try {
    await page.click('text=Click to Start', { timeout: 5000 });
    console.log('✓ Clicked past landing page');
  } catch (e) {
    console.log('- No "Click to Start" button found, checking for other navigation');
    try {
      await page.click('button', { timeout: 5000 });
      console.log('✓ Clicked generic button');
    } catch (e2) {
      console.log('- No clickable buttons found');
    }
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'after-landing.png' });

  // Check if we're on login screen
  const loginForm = await page.$('form');
  if (loginForm) {
    console.log('✓ Found login form');
    await page.screenshot({ path: 'login-screen.png' });

    // Check login form styling
    const loginContainer = await page.$('[class*="Login"]');
    if (loginContainer) {
      const styles = await page.evaluate((element) => {
        const computed = window.getComputedStyle(element);
        return {
          background: computed.background,
          width: computed.width,
          maxWidth: computed.maxWidth,
          padding: computed.padding,
          borderRadius: computed.borderRadius
        };
      }, loginContainer);
      console.log('Login container styles:', styles);
    }

    // Try to navigate to register
    try {
      await page.click('text=Sign up', { timeout: 3000 });
      console.log('✓ Found register link');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'register-screen.png' });
    } catch (e) {
      console.log('- No register link found');
    }
  }

  console.log('✓ Test completed');

  // Keep browser open for manual inspection
  console.log('Browser will stay open for manual inspection...');
  // await browser.close();
})();