const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🧪 Testing cleaned up application...');

  try {
    // Navigate to the new port
    await page.goto('http://localhost:3002');
    await page.waitForTimeout(2000);

    console.log('✅ Landing page loaded');

    // Click to start
    const startButton = await page.$('text=Click to Start');
    if (startButton) {
      await startButton.click();
      console.log('✅ Clicked to start');
      await page.waitForTimeout(1000);
    }

    // Should see login page
    const loginForm = await page.$('form');
    if (loginForm) {
      console.log('✅ Login page displayed');

      // Go to register
      const registerLink = await page.$('text=Sign up');
      if (registerLink) {
        await registerLink.click();
        console.log('✅ Navigation to register works');
        await page.waitForTimeout(1000);
      }

      // Try to register
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');

      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        console.log('✅ Registration form submitted');
        await page.waitForTimeout(2000);
      }

      // Should now be in character creation
      const characterCreation = await page.$('text=Character Creation');
      if (characterCreation) {
        console.log('✅ Character creation screen loaded');

        // Fill out character
        await page.fill('input[placeholder="Character name"]', 'TestPhilosopher');

        // Select portrait
        const portraitSelect = await page.$('select#portrait');
        if (portraitSelect) {
          await portraitSelect.selectOption({ index: 1 });
          console.log('✅ Portrait selected');
        }

        // Click create button
        const createButton = await page.$('text=Begin Your Philosophical Journey');
        if (createButton) {
          await createButton.click();
          console.log('✅ Character creation completed');
          await page.waitForTimeout(3000);
        }

        // Should now be in main game interface
        const worldMap = await page.$('text=World Map');
        if (worldMap) {
          console.log('✅ Main game interface loaded with World Map');
          console.log('🎉 ALL TESTS PASSED - Application is working correctly!');
        } else {
          console.log('❌ Main game interface not found');
        }
      } else {
        console.log('❌ Character creation not found');
      }
    } else {
      console.log('❌ Login form not found');
    }

    await page.screenshot({ path: 'final-test.png' });
    console.log('📸 Screenshot saved as final-test.png');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    console.log('🏁 Test completed - leaving browser open for inspection');
    // await browser.close();
  }
})();