const { chromium } = require('playwright');

async function debugCharacterCreation() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 Debug: Loading landing page...');
    await page.goto('http://localhost:3000');

    // Wait for and click start
    await page.waitForSelector('text=Click to Start', { timeout: 10000 });
    await page.locator('text=Click to Start').click();
    console.log('✅ Debug: Clicked start button');

    // Authentication
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', 'admin');
    await page.getByRole('button', { name: /sign in/i }).click();
    console.log('✅ Debug: Signed in');

    // Wait and screenshot current state
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'debug-current-state.png', fullPage: true });

    // Check what's on the page
    const headings = await page.locator('h1, h2, h3').allTextContents();
    console.log('🔍 Debug: Found headings:', headings);

    const buttons = await page.locator('button').allTextContents();
    console.log('🔍 Debug: Found buttons:', buttons);

    const url = page.url();
    console.log('🔍 Debug: Current URL:', url);

    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('❌ Debug error:', error);
    await page.screenshot({ path: 'debug-error-state.png', fullPage: true });
  }

  await browser.close();
}

debugCharacterCreation();