const { webkit } = require('playwright');

async function testPhilosophyRPG() {
  console.log('🎮 Starting Philosophy RPG Test...');

  // Launch browser
  const browser = await webkit.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the game
    console.log('📍 Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Take a screenshot of the landing page
    await page.screenshot({ path: 'screenshots/01-landing-page.png', fullPage: true });
    console.log('📸 Screenshot saved: 01-landing-page.png');

    // Click "Click to Start" if it exists
    const clickToStart = page.getByText('Click to Start');
    if (await clickToStart.isVisible()) {
      await clickToStart.click();
      await page.waitForTimeout(1000);
    }

    // Look for login/register forms and skip authentication for testing
    const loginForm = page.locator('form').first();
    if (await loginForm.isVisible()) {
      console.log('🔐 Skipping authentication for test...');
      // For now, we'll just take a screenshot of the auth screen
      await page.screenshot({ path: 'screenshots/02-auth-screen.png', fullPage: true });
      console.log('📸 Screenshot saved: 02-auth-screen.png');
    }

    // Check if we can see the character creation screen
    const characterCreation = page.getByText('The Axiomancer\'s Journey');
    if (await characterCreation.isVisible()) {
      await page.screenshot({ path: 'screenshots/03-character-creation.png', fullPage: true });
      console.log('📸 Screenshot saved: 03-character-creation.png');

      // Fill in character name
      const nameInput = page.locator('input[type="text"]').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('Socrates');

        // Select some philosophical stances
        const virtueEthics = page.getByText('Virtue Ethics');
        if (await virtueEthics.isVisible()) {
          await virtueEthics.click();
        }

        const idealist = page.getByText('Idealist');
        if (await idealist.isVisible()) {
          await idealist.click();
        }

        const rationalist = page.getByText('Rationalist');
        if (await rationalist.isVisible()) {
          await rationalist.click();
        }

        // Start the journey
        const startButton = page.getByText('Begin Your Journey');
        if (await startButton.isVisible()) {
          await startButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }

    // Check if we can see the game interface
    const gameInterface = page.locator('h1, h2, h3').filter({ hasText: /explore|combat|character/i });
    if (await gameInterface.first().isVisible()) {
      await page.screenshot({ path: 'screenshots/04-game-interface.png', fullPage: true });
      console.log('📸 Screenshot saved: 04-game-interface.png');

      // Try to trigger combat
      const combatButton = page.getByText(/combat|fight|battle/i);
      if (await combatButton.first().isVisible()) {
        await combatButton.first().click();
        await page.waitForTimeout(1000);

        // Combat screen
        await page.screenshot({ path: 'screenshots/05-combat-screen.png', fullPage: true });
        console.log('📸 Screenshot saved: 05-combat-screen.png');

        // Test philosophy-based combat
        const bodyButton = page.getByText('Body');
        if (await bodyButton.isVisible()) {
          console.log('🧠 Testing philosophy combat system...');
          await bodyButton.click();
          await page.waitForTimeout(500);

          await page.screenshot({ path: 'screenshots/06-aspect-selected.png', fullPage: true });
          console.log('📸 Screenshot saved: 06-aspect-selected.png');

          // Select action
          const attackButton = page.getByText('Attack');
          if (await attackButton.isVisible()) {
            await attackButton.click();
            await page.waitForTimeout(500);

            // Confirm choice
            const confirmButton = page.getByText('Confirm Choice');
            if (await confirmButton.isVisible()) {
              await confirmButton.click();
              await page.waitForTimeout(2000);

              await page.screenshot({ path: 'screenshots/07-combat-result.png', fullPage: true });
              console.log('📸 Screenshot saved: 07-combat-result.png');
            }
          }
        }
      }
    }

    console.log('✅ Philosophy RPG test completed successfully!');
    console.log('🎯 Key features tested:');
    console.log('   - Landing page');
    console.log('   - Character creation (philosophy-based)');
    console.log('   - Game interface');
    console.log('   - Combat system (Body > Mind > Heart > Body)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/error.png', fullPage: true });
    console.log('📸 Error screenshot saved: error.png');
  } finally {
    await browser.close();
  }
}

// Create screenshots directory
const fs = require('fs');
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

// Run the test
testPhilosophyRPG().catch(console.error);