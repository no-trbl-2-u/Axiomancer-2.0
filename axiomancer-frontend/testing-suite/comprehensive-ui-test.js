const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function comprehensiveUITest() {
  console.log('🔍 Starting Comprehensive Axiomancer UI Test...');

  const screenshotsDir = path.join(__dirname, 'comprehensive-screenshots');
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

    // 1. Landing Page
    await page.screenshot({
      path: path.join(screenshotsDir, '01-landing-page.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: Landing page');

    // Click to start
    await page.click('body'); // The whole container is clickable
    await page.waitForTimeout(1000);

    // 2. Auth/Login Page
    await page.screenshot({
      path: path.join(screenshotsDir, '02-auth-page.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: Auth page');

    // Try to register a test user
    const registerButton = page.locator('button:has-text("Register"), a:has-text("Register")');
    if (await registerButton.isVisible()) {
      await registerButton.click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(screenshotsDir, '03-register-page.png'),
        fullPage: true
      });
      console.log('📸 Screenshot: Register page');

      // Fill registration form
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]').first();
      const confirmPasswordInput = page.locator('input[type="password"]').last();

      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
        await passwordInput.fill('testpassword123');
        if (await confirmPasswordInput.isVisible() && confirmPasswordInput !== passwordInput) {
          await confirmPasswordInput.fill('testpassword123');
        }

        const submitButton = page.locator('button[type="submit"], button:has-text("Register")').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(2000);
        }
      }
    } else {
      // If already on login, try to login
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
        await passwordInput.fill('testpassword123');

        const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }

    // 3. Character Creation
    await page.screenshot({
      path: path.join(screenshotsDir, '04-character-creation.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: Character creation');

    // Fill character creation if visible
    const nameInput = page.locator('input[type="text"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Socrates');

      // Select philosophical stances
      const philosophyButtons = page.locator('button').filter({ hasText: /virtue|deontological|utilitarian|idealist|materialist|rationalist|empiricist/i });
      const count = await philosophyButtons.count();

      for (let i = 0; i < Math.min(3, count); i++) {
        await philosophyButtons.nth(i).click();
        await page.waitForTimeout(200);
      }

      await page.screenshot({
        path: path.join(screenshotsDir, '05-character-creation-filled.png'),
        fullPage: true
      });
      console.log('📸 Screenshot: Character creation filled');

      // Begin journey
      const beginButton = page.locator('button:has-text("Begin"), button:has-text("Start"), button:has-text("Create")');
      if (await beginButton.first().isVisible()) {
        await beginButton.first().click();
        await page.waitForTimeout(3000);
      }
    }

    // 4. Main Game Interface
    await page.screenshot({
      path: path.join(screenshotsDir, '06-main-game-interface.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: Main game interface');

    // Test different game screens
    const screens = [
      { name: 'exploration', patterns: [/explore/i, /world/i, /location/i] },
      { name: 'combat', patterns: [/combat/i, /battle/i, /fight/i] },
      { name: 'character', patterns: [/character/i, /stats/i, /profile/i] },
      { name: 'inventory', patterns: [/inventory/i, /items/i, /equipment/i] },
      { name: 'map', patterns: [/map/i, /world/i] }
    ];

    for (const screen of screens) {
      for (const pattern of screen.patterns) {
        const button = page.locator(`button:has-text("${pattern.source}"), [role="tab"]:has-text("${pattern.source}"), a:has-text("${pattern.source}")`).first();
        if (await button.isVisible()) {
          console.log(`🎮 Testing ${screen.name} screen`);
          await button.click();
          await page.waitForTimeout(1000);

          await page.screenshot({
            path: path.join(screenshotsDir, `07-${screen.name}-screen.png`),
            fullPage: true
          });
          console.log(`📸 Screenshot: ${screen.name} screen`);
          break;
        }
      }
    }

    // 5. Mobile Testing
    console.log('📱 Testing mobile viewport...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(screenshotsDir, '08-mobile-main.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: Mobile main interface');

    // Test mobile navigation menu
    const mobileMenu = page.locator('button:has-text("☰"), button:has-text("≡"), [role="button"]:has-text("Menu")').first();
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(screenshotsDir, '09-mobile-menu.png'),
        fullPage: true
      });
      console.log('📸 Screenshot: Mobile menu');
    }

    // 6. Landscape mobile
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(screenshotsDir, '10-mobile-landscape.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: Mobile landscape');

    // 7. Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(screenshotsDir, '11-tablet-portrait.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: Tablet portrait');

    console.log('✅ Comprehensive UI test completed!');
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({
      path: path.join(screenshotsDir, 'error-state.png'),
      fullPage: true
    });
    throw error;
  } finally {
    await browser.close();
  }
}

comprehensiveUITest().catch(console.error);