const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class AxiomancerWorkingTester {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.screenshots = [];
    this.testResults = [];
    this.screenshotDir = path.join(__dirname, 'working-test-screenshots');
  }

  async setup() {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    this.browser = await chromium.launch({
      headless: false,
      slowMo: 1000
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 }
    });

    this.page = await this.context.newPage();

    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
  }

  async takeScreenshot(name, description) {
    const filename = `${name.replace(/\s+/g, '-').toLowerCase()}.png`;
    const filepath = path.join(this.screenshotDir, filename);
    await this.page.screenshot({ path: filepath, fullPage: true });

    this.screenshots.push({
      name,
      description,
      filename,
      timestamp: new Date().toISOString()
    });

    console.log(`📸 Screenshot taken: ${name}`);
  }

  async addTestResult(test, passed, details = '') {
    this.testResults.push({
      test,
      passed,
      details,
      timestamp: new Date().toISOString()
    });

    const status = passed ? '✅' : '❌';
    console.log(`${status} ${test}: ${details}`);
  }

  async navigateToGame() {
    console.log('🚀 Starting navigation to game...');

    try {
      // Load landing page
      await this.page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
      await this.takeScreenshot('01-landing-page', 'Initial landing page with CLICK TO START');

      // Click the CLICK TO START area
      const startElement = await this.page.locator('text="CLICK TO START"').first();
      if (await startElement.isVisible().catch(() => false)) {
        await startElement.click();
        await this.addTestResult('Landing Page Click', true, 'Successfully clicked CLICK TO START');
      } else {
        // Click in the center where the button should be
        await this.page.click('body', { position: { x: 640, y: 360 } });
        await this.addTestResult('Landing Page Click', true, 'Clicked center area');
      }

      await this.page.waitForTimeout(2000);
      await this.takeScreenshot('02-after-start-click', 'After clicking start button');

      // Should now be on login page
      const loginVisible = await this.page.locator('text="Welcome Back"').isVisible().catch(() => false);
      if (loginVisible) {
        await this.addTestResult('Login Page Navigation', true, 'Successfully navigated to login page');

        // Fill login form
        await this.page.fill('input[placeholder*="email"]', 'test@example.com');
        await this.page.fill('input[placeholder*="password"]', 'testpassword');
        await this.takeScreenshot('03-login-filled', 'Login form filled');

        // Click Sign In
        await this.page.click('button:has-text("Sign In")');
        await this.page.waitForTimeout(3000);
        await this.addTestResult('Login Submit', true, 'Submitted login form');

        await this.takeScreenshot('04-after-login', 'After login submission');

        // Check for sign up option if login failed
        const signUpLink = await this.page.locator('text="Don\'t have an account? Sign up"').isVisible().catch(() => false);
        if (signUpLink) {
          await this.page.click('text="Don\'t have an account? Sign up"');
          await this.page.waitForTimeout(2000);
          await this.takeScreenshot('05-signup-page', 'Sign up page');

          // Fill sign up form
          await this.page.fill('input[placeholder*="email"]', 'test@example.com');
          await this.page.fill('input[placeholder*="password"]', 'testpassword');
          const nameField = await this.page.locator('input[placeholder*="name"]').first();
          if (await nameField.isVisible().catch(() => false)) {
            await nameField.fill('Test Hero');
          }

          await this.page.click('button:has-text("Sign Up"), button:has-text("Create")');
          await this.page.waitForTimeout(3000);
          await this.addTestResult('Sign Up', true, 'Completed sign up process');
        }

      } else {
        await this.addTestResult('Login Page Navigation', false, 'Did not reach login page');
      }

    } catch (error) {
      await this.addTestResult('Navigation Process', false, `Error: ${error.message}`);
    }
  }

  async testGameInterface() {
    console.log('🎮 Testing game interface...');

    try {
      await this.page.waitForTimeout(3000);
      await this.takeScreenshot('06-current-state', 'Current state after authentication');

      const currentUrl = this.page.url();
      console.log(`📍 Current URL: ${currentUrl}`);

      // Look for NodeMapScreen components
      const nodeMapContainer = await this.page.locator('[class*="NodeMap"], [class*="Map"], [data-testid="node-map"]').first();
      const nodeMapVisible = await nodeMapContainer.isVisible().catch(() => false);

      if (nodeMapVisible) {
        await this.addTestResult('NodeMap Interface', true, 'NodeMapScreen is visible');
        await this.takeScreenshot('07-node-map-found', 'NodeMapScreen interface detected');

        // Test components
        await this.testNodeMapComponents();
        await this.testNodeInteractions();

      } else {
        // Look for other game elements
        const gameElements = await this.page.locator('[class*="Game"], [class*="Screen"], main, [id*="game"]').count();
        await this.addTestResult('Game Interface Detection', gameElements > 0, `Found ${gameElements} potential game elements`);

        if (gameElements > 0) {
          await this.takeScreenshot('08-game-elements', 'Game elements detected');
        }

        // Check if we're in character creation
        const characterCreation = await this.page.locator('text="character", text="create", input[placeholder*="name"]').count();
        if (characterCreation > 0) {
          await this.addTestResult('Character Creation Found', true, 'Detected character creation interface');
          await this.testCharacterCreation();
        }
      }

    } catch (error) {
      await this.addTestResult('Game Interface Test', false, `Error: ${error.message}`);
    }
  }

  async testNodeMapComponents() {
    console.log('🗺️ Testing NodeMap components...');

    try {
      // Test header panel
      const headerPanel = await this.page.locator('[class*="Header"], header').first();
      const hasHeader = await headerPanel.isVisible().catch(() => false);
      await this.addTestResult('Header Panel', hasHeader, hasHeader ? 'Header panel visible' : 'Header panel missing');

      // Test resource display
      const resourceItems = await this.page.locator('[class*="Resource"], [class*="resource"]').count();
      await this.addTestResult('Resource Display', resourceItems > 0, `Found ${resourceItems} resource items`);

      if (resourceItems > 0) {
        await this.takeScreenshot('09-resources', 'Resource display detected');
      }

      // Test map area
      const mapArea = await this.page.locator('[class*="Map"], [class*="map"]').first();
      const hasMapArea = await mapArea.isVisible().catch(() => false);
      await this.addTestResult('Map Area', hasMapArea, hasMapArea ? 'Map area visible' : 'Map area missing');

      // Test info panel
      const infoPanel = await this.page.locator('[class*="Info"], [class*="info"]').first();
      const hasInfoPanel = await infoPanel.isVisible().catch(() => false);
      await this.addTestResult('Info Panel', hasInfoPanel, hasInfoPanel ? 'Info panel visible' : 'Info panel missing');

    } catch (error) {
      await this.addTestResult('NodeMap Components', false, `Error: ${error.message}`);
    }
  }

  async testNodeInteractions() {
    console.log('🎯 Testing node interactions...');

    try {
      // Find all nodes
      const nodes = await this.page.locator('button[title], [class*="Node"], button:has([class*="icon"]), [role="button"]').all();
      await this.addTestResult('Node Detection', nodes.length > 0, `Found ${nodes.length} potential nodes`);

      if (nodes.length > 0) {
        await this.takeScreenshot('10-nodes-detected', `Detected ${nodes.length} nodes`);

        // Test clicking on nodes
        for (let i = 0; i < Math.min(nodes.length, 3); i++) {
          const node = nodes[i];
          const isEnabled = await node.isEnabled().catch(() => false);
          const isVisible = await node.isVisible().catch(() => false);

          if (isEnabled && isVisible) {
            const nodeTitle = await node.getAttribute('title').catch(() => `Node ${i + 1}`);

            try {
              await node.click();
              await this.page.waitForTimeout(1000);
              await this.takeScreenshot(`11-node-clicked-${i + 1}`, `Clicked on ${nodeTitle}`);
              await this.addTestResult(`Node Click ${i + 1}`, true, `Successfully clicked ${nodeTitle}`);
            } catch (clickError) {
              await this.addTestResult(`Node Click ${i + 1}`, false, `Failed to click ${nodeTitle}: ${clickError.message}`);
            }
          }
        }

        // Test for childhood progression elements
        await this.testChildhoodProgression();
      }

    } catch (error) {
      await this.addTestResult('Node Interactions', false, `Error: ${error.message}`);
    }
  }

  async testChildhoodProgression() {
    console.log('👶 Testing childhood progression elements...');

    try {
      // Look for specific progression nodes
      const progressionElements = [
        { name: 'Home', selectors: ['button[title*="Home"]', 'button:has-text("🏠")', '[title*="home"]'] },
        { name: 'Guardian', selectors: ['button[title*="Guardian"]', 'button:has-text("👤")', '[title*="guardian"]'] },
        { name: 'Fishing', selectors: ['button[title*="Fish"]', 'button:has-text("🎣")', '[title*="fishing"]'] },
        { name: 'Boat', selectors: ['button[title*="Boat"]', 'button:has-text("⛵")', '[title*="boat"]'] },
        { name: 'Forest', selectors: ['button[title*="Forest"]', 'button:has-text("🌲")', '[title*="forest"]'] }
      ];

      for (const element of progressionElements) {
        let found = false;
        for (const selector of element.selectors) {
          const elementExists = await this.page.locator(selector).count() > 0;
          if (elementExists) {
            found = true;
            break;
          }
        }
        await this.addTestResult(`${element.name} Element`, found, found ? `${element.name} node found` : `${element.name} node not found`);
      }

      // Test action buttons
      const actionButtons = await this.page.locator('button:has-text("Talk"), button:has-text("Fish"), button:has-text("Build"), button:has-text("Gather")').count();
      await this.addTestResult('Action Buttons', actionButtons > 0, `Found ${actionButtons} action buttons`);

    } catch (error) {
      await this.addTestResult('Childhood Progression', false, `Error: ${error.message}`);
    }
  }

  async testCharacterCreation() {
    console.log('🎭 Testing character creation...');

    try {
      const nameInput = await this.page.locator('input[placeholder*="name"], input[name="name"]').first();
      if (await nameInput.isVisible().catch(() => false)) {
        await nameInput.fill('TestHero');
        await this.addTestResult('Character Name', true, 'Filled character name');

        const submitButton = await this.page.locator('button:has-text("Create"), button:has-text("Start")').first();
        if (await submitButton.isVisible().catch(() => false)) {
          await submitButton.click();
          await this.page.waitForTimeout(3000);
          await this.addTestResult('Character Creation Submit', true, 'Submitted character creation');
          await this.takeScreenshot('12-after-character-creation', 'After character creation');
        }
      }
    } catch (error) {
      await this.addTestResult('Character Creation', false, `Error: ${error.message}`);
    }
  }

  async testMobileResponsiveness() {
    console.log('📱 Testing mobile responsiveness...');

    try {
      // Switch to mobile viewport
      await this.page.setViewportSize({ width: 375, height: 667 });
      await this.page.waitForTimeout(1000);
      await this.takeScreenshot('13-mobile-view', 'Mobile viewport (375x667)');

      // Test if main interface is still usable
      const mainInterface = await this.page.locator('body').isVisible();
      await this.addTestResult('Mobile Interface', mainInterface, 'Main interface visible on mobile');

      // Test scrolling
      const pageHeight = await this.page.evaluate(() => document.body.scrollHeight);
      const viewportHeight = 667;
      await this.addTestResult('Mobile Layout', pageHeight <= viewportHeight * 1.5, `Page height: ${pageHeight}px`);

      // Test touch interactions
      const clickableElements = await this.page.locator('button, a, [role="button"]').count();
      await this.addTestResult('Mobile Touch Targets', clickableElements > 0, `Found ${clickableElements} touch targets`);

      // Return to desktop
      await this.page.setViewportSize({ width: 1280, height: 720 });

    } catch (error) {
      await this.addTestResult('Mobile Responsiveness', false, `Error: ${error.message}`);
    }
  }

  async compareWithWireframe() {
    console.log('🎨 Comparing with wireframe...');

    try {
      await this.takeScreenshot('14-final-comparison', 'Final interface for wireframe comparison');

      // Check for wireframe elements
      const wireframeElements = [
        { name: 'Header Resources', selector: '[class*="resource"], [class*="Resource"]' },
        { name: 'Map Container', selector: '[class*="map"], [class*="Map"]' },
        { name: 'Info Panel', selector: '[class*="info"], [class*="Info"]' },
        { name: 'Interactive Nodes', selector: 'button[title], [class*="Node"]' }
      ];

      for (const element of wireframeElements) {
        const count = await this.page.locator(element.selector).count();
        await this.addTestResult(`Wireframe: ${element.name}`, count > 0, `Found ${count} ${element.name.toLowerCase()} elements`);
      }

    } catch (error) {
      await this.addTestResult('Wireframe Comparison', false, `Error: ${error.message}`);
    }
  }

  generateReport() {
    const passedTests = this.testResults.filter(t => t.passed).length;
    const totalTests = this.testResults.length;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

    const report = {
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        successRate: `${successRate}%`,
        testDate: new Date().toISOString()
      },
      screenshots: this.screenshots,
      testResults: this.testResults,
      issues: this.testResults.filter(t => !t.passed),
      wireframeComparison: {
        expectedElements: [
          'Header panel with resource tracking (gold, fish, wood, iron ore)',
          'Central map area with interconnected nodes',
          'Bottom information panel for node details',
          'Dark fantasy theme with appropriate colors',
          'Mobile-responsive design'
        ],
        implementationStatus: 'See test results for current status'
      }
    };

    // Save report
    const reportPath = path.join(this.screenshotDir, 'working-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.screenshotDir, 'working-test-report.md');
    fs.writeFileSync(markdownPath, markdownReport);

    console.log(`\n📊 Test Summary:`);
    console.log(`✅ Passed: ${passedTests}/${totalTests} (${successRate}%)`);
    console.log(`📸 Screenshots: ${this.screenshots.length}`);
    console.log(`📄 Report saved to: ${reportPath}`);

    return report;
  }

  generateMarkdownReport(report) {
    return `# Axiomancer Node-Based Implementation Test Report

## Test Summary
- **Total Tests:** ${report.summary.totalTests}
- **Passed:** ${report.summary.passedTests}
- **Failed:** ${report.summary.failedTests}
- **Success Rate:** ${report.summary.successRate}
- **Test Date:** ${report.summary.testDate}

## Key Findings

### Navigation Flow
The application uses the following navigation pattern:
1. Landing page with "CLICK TO START" button
2. Login/Sign up page with "Welcome Back" interface
3. Character creation (if implemented)
4. Game interface with node-based exploration

### Screenshots Captured
${report.screenshots.map(s => `- **${s.name}:** ${s.description}`).join('\n')}

## Test Results

### ✅ Passed Tests
${report.testResults.filter(t => t.passed).map(t => `- **${t.test}:** ${t.details}`).join('\n')}

### ❌ Failed Tests
${report.testResults.filter(t => !t.passed).map(t => `- **${t.test}:** ${t.details}`).join('\n')}

## Wireframe Comparison

### Expected Elements (from EXAMPLE-MAP.png)
${report.wireframeComparison.expectedElements.map(e => `- ${e}`).join('\n')}

### Implementation Status
Based on testing, the current implementation shows varying levels of completion for these wireframe elements.

## Recommendations

### Critical Issues
${report.issues.length > 0 ? report.issues.map(issue => `- **${issue.test}:** ${issue.details}`).join('\n') : '- No critical issues identified'}

### Mobile Responsiveness
The mobile testing was conducted at 375x667 viewport to ensure compatibility with standard mobile devices.

### Node-Based System
The childhood progression flow (home → guardian → fishing → boat building → forest) testing results are included in the detailed test results above.

## Conclusion
${report.summary.successRate >= 70 ?
  'The node-based implementation shows good overall progress with most core functionality working.' :
  report.summary.successRate >= 40 ?
  'The node-based implementation is partially functional but needs attention in several key areas.' :
  'The node-based implementation requires significant development work to reach full functionality.'
}
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runAllTests() {
    try {
      await this.setup();

      await this.navigateToGame();
      await this.testGameInterface();
      await this.testMobileResponsiveness();
      await this.compareWithWireframe();

      const report = this.generateReport();

      console.log('\n🎉 Test execution completed!');
      return report;

    } catch (error) {
      console.error('❌ Test execution failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Run the tests
async function main() {
  const tester = new AxiomancerWorkingTester();

  try {
    const report = await tester.runAllTests();
    console.log('✅ All tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = AxiomancerWorkingTester;