const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function analyzeAxiomancerUI() {
  console.log('🔍 Starting Axiomancer UI Analysis...');

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'ui-analysis-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // Navigate to the app
    console.log('📍 Navigating to http://localhost:3002');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

    // 1. DESKTOP SCREENSHOTS
    console.log('📸 Capturing desktop screenshots...');

    // Initial landing page
    await page.screenshot({
      path: path.join(screenshotsDir, '01-desktop-landing.png'),
      fullPage: true
    });

    // Try to start the game
    const startButton = page.locator('button, [role="button"]').filter({ hasText: /start|begin|enter/i });
    if (await startButton.first().isVisible()) {
      await startButton.first().click();
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: path.join(screenshotsDir, '02-desktop-after-start.png'),
        fullPage: true
      });
    }

    // Look for character creation or auth screen
    const authForm = page.locator('form, input[type="email"], input[type="password"]');
    if (await authForm.first().isVisible()) {
      await page.screenshot({
        path: path.join(screenshotsDir, '03-desktop-auth.png'),
        fullPage: true
      });

      // Try to skip/bypass auth for testing
      const skipButton = page.locator('button').filter({ hasText: /skip|guest|demo/i });
      if (await skipButton.first().isVisible()) {
        await skipButton.first().click();
        await page.waitForTimeout(1000);
      }
    }

    // Character creation screen
    const characterCreation = page.locator('text=/character|axiomancer|journey|philosophy/i').first();
    if (await characterCreation.isVisible()) {
      await page.screenshot({
        path: path.join(screenshotsDir, '04-desktop-character-creation.png'),
        fullPage: true
      });

      // Try to fill out character creation quickly
      const nameInput = page.locator('input[type="text"]').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('TestPhilosopher');

        // Select philosophical stances if available
        const philosophyOptions = page.locator('button, [role="button"]').filter({
          hasText: /virtue|deontological|utilitarian|idealist|materialist|rationalist|empiricist/i
        });

        const optionCount = await philosophyOptions.count();
        if (optionCount > 0) {
          // Select first few available options
          for (let i = 0; i < Math.min(3, optionCount); i++) {
            await philosophyOptions.nth(i).click();
            await page.waitForTimeout(200);
          }
        }

        // Look for begin/start button
        const beginButton = page.locator('button').filter({ hasText: /begin|start|create|continue/i });
        if (await beginButton.first().isVisible()) {
          await beginButton.first().click();
          await page.waitForTimeout(2000);
        }
      }
    }

    // Main game interface
    await page.screenshot({
      path: path.join(screenshotsDir, '05-desktop-main-game.png'),
      fullPage: true
    });

    // Try to navigate to different game screens
    const navigationButtons = [
      /explore|exploration/i,
      /map|world/i,
      /combat|battle|fight/i,
      /character|stats/i,
      /inventory|items/i,
      /settings|options/i
    ];

    for (let i = 0; i < navigationButtons.length; i++) {
      const navButton = page.locator('button, [role="button"], a, [role="tab"]').filter({
        hasText: navigationButtons[i]
      });

      if (await navButton.first().isVisible()) {
        console.log(`🎮 Testing navigation to: ${navigationButtons[i].source}`);
        await navButton.first().click();
        await page.waitForTimeout(1000);

        await page.screenshot({
          path: path.join(screenshotsDir, `06-desktop-nav-${i + 1}-${navigationButtons[i].source.replace(/[^a-z]/gi, '')}.png`),
          fullPage: true
        });
      }
    }

    // Test combat if available
    const combatTrigger = page.locator('button').filter({ hasText: /attack|fight|combat|enemy/i });
    if (await combatTrigger.first().isVisible()) {
      console.log('⚔️ Testing combat interface...');
      await combatTrigger.first().click();
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: path.join(screenshotsDir, '07-desktop-combat.png'),
        fullPage: true
      });

      // Try philosophy-based combat actions
      const aspectButtons = page.locator('button').filter({ hasText: /body|mind|heart|soul/i });
      if (await aspectButtons.first().isVisible()) {
        await aspectButtons.first().click();
        await page.waitForTimeout(500);

        await page.screenshot({
          path: path.join(screenshotsDir, '08-desktop-combat-aspect.png'),
          fullPage: true
        });

        // Try to select an action
        const actionButtons = page.locator('button').filter({ hasText: /attack|defend|special/i });
        if (await actionButtons.first().isVisible()) {
          await actionButtons.first().click();
          await page.waitForTimeout(500);

          // Confirm if needed
          const confirmButton = page.locator('button').filter({ hasText: /confirm|execute|proceed/i });
          if (await confirmButton.first().isVisible()) {
            await confirmButton.first().click();
            await page.waitForTimeout(1500);

            await page.screenshot({
              path: path.join(screenshotsDir, '09-desktop-combat-result.png'),
              fullPage: true
            });
          }
        }
      }
    }

    // 2. MOBILE SCREENSHOTS
    console.log('📱 Testing mobile viewport (375x667)...');

    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Navigate back to start
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

    await page.screenshot({
      path: path.join(screenshotsDir, '10-mobile-landing.png'),
      fullPage: true
    });

    // Try to navigate through the same flow on mobile
    const mobileStartButton = page.locator('button, [role="button"]').filter({ hasText: /start|begin|enter/i });
    if (await mobileStartButton.first().isVisible()) {
      await mobileStartButton.first().click();
      await page.waitForTimeout(1000);
    }

    await page.screenshot({
      path: path.join(screenshotsDir, '11-mobile-main-interface.png'),
      fullPage: true
    });

    // Test navigation menu on mobile
    const mobileMenuButton = page.locator('button').filter({ hasText: /menu|☰|≡/i });
    if (await mobileMenuButton.first().isVisible()) {
      await mobileMenuButton.first().click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(screenshotsDir, '12-mobile-menu-open.png'),
        fullPage: true
      });
    }

    // Test different orientations
    console.log('🔄 Testing landscape orientation...');
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(screenshotsDir, '13-mobile-landscape.png'),
      fullPage: true
    });

    // 3. TABLET SCREENSHOTS
    console.log('📱 Testing tablet viewport (768x1024)...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(screenshotsDir, '14-tablet-portrait.png'),
      fullPage: true
    });

    // Test tablet landscape
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(screenshotsDir, '15-tablet-landscape.png'),
      fullPage: true
    });

    console.log('✅ UI Analysis completed successfully!');
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

  } catch (error) {
    console.error('❌ UI Analysis failed:', error.message);
    await page.screenshot({
      path: path.join(screenshotsDir, 'error-state.png'),
      fullPage: true
    });
    console.log('📸 Error screenshot saved');
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the analysis
analyzeAxiomancerUI().catch(console.error);