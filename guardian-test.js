const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🧪 Testing Guardian Progression System...');

    // Navigate to application
    await page.goto('http://localhost:3002');
    await page.waitForTimeout(2000);

    // Click to start
    await page.click('text=Click to Start');
    await page.waitForTimeout(1000);

    // Register a new account
    await page.click('text=Sign up');
    await page.fill('input[type="email"]', 'guardian-test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Create character
    await page.fill('input[placeholder="Character name"]', 'GuardianTester');
    await page.selectOption('select#portrait', { index: 1 });
    await page.click('text=Begin Your Philosophical Journey');
    await page.waitForTimeout(3000);

    console.log('✅ Character created, now in main game interface');

    // Should be on World Map tab, in fishing village
    const mapTab = await page.$('text=World Map');
    if (mapTab) {
      console.log('✅ Found World Map tab');
    }

    // Try to click guardian node
    console.log('🎭 Looking for guardian node...');
    const guardianNode = await page.$('[style*="left: 30%"][style*="top: 70%"]');
    if (guardianNode) {
      console.log('✅ Found guardian node, clicking...');
      await guardianNode.click();
      await page.waitForTimeout(2000);

      // Should see guardian dialogue modal
      const guardianModal = await page.$('text=Guardian\'s Wisdom');
      if (guardianModal) {
        console.log('✅ Guardian dialogue modal opened');

        // Check console logs for debug info
        page.on('console', msg => {
          if (msg.text().includes('🎭') || msg.text().includes('🌟') || msg.text().includes('🔓')) {
            console.log('Console:', msg.text());
          }
        });

        // Click the first choice to learn reasoning
        const learnButton = await page.$('text=Please teach me, Guardian. I am ready to learn.');
        if (learnButton) {
          console.log('🎓 Clicking to learn from guardian...');
          await learnButton.click();
          await page.waitForTimeout(2000);

          // Should see completion message
          const completionButton = await page.$('text=Continue Journey');
          if (completionButton) {
            console.log('✅ Guardian teaching completed');
            await completionButton.click();
            await page.waitForTimeout(2000);

            // Now check if other nodes are unlocked
            console.log('🔍 Checking if nodes are now unlocked...');

            // Try clicking on another node that should now be unlocked
            const townSquareNode = await page.$('[style*="left: 50%"][style*="top: 60%"]');
            if (townSquareNode) {
              console.log('🏛️ Trying to click town square node...');
              await townSquareNode.click();
              await page.waitForTimeout(2000);

              // Should see an event modal instead of "need guardian" message
              const eventModal = await page.$('.modal-content'); // Generic modal selector
              if (eventModal) {
                console.log('🎉 SUCCESS! Town square node is now accessible!');
              } else {
                console.log('❌ Town square node still not accessible');
              }
            }
          }
        }
      } else {
        console.log('❌ Guardian dialogue modal not found');
      }
    } else {
      console.log('❌ Guardian node not found');
    }

    await page.screenshot({ path: 'guardian-test.png' });
    console.log('📸 Screenshot saved as guardian-test.png');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  console.log('🏁 Test completed - leaving browser open');
  // await browser.close();
})();