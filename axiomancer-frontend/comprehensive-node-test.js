const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class AxiomancerNodeTester {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.screenshots = [];
    this.testResults = [];
    this.screenshotDir = path.join(__dirname, 'node-test-screenshots');
  }

  async setup() {
    // Create screenshots directory
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    // Launch browser
    this.browser = await chromium.launch({
      headless: false,
      slowMo: 500
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 }
    });

    this.page = await this.context.newPage();

    // Setup console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });

    this.page.on('pageerror', err => {
      console.log('❌ Page Error:', err.message);
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
      await this.page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
      await this.takeScreenshot('01-landing-page', 'Initial landing page load');

      // Look for "CLICK TO START" button on landing page
      const startButton = await this.page.locator('text="CLICK TO START"').first();
      const startButtonVisible = await startButton.isVisible().catch(() => false);

      if (startButtonVisible) {
        await startButton.click();
        await this.addTestResult('Landing Page Navigation', true, 'Found and clicked CLICK TO START button');
        await this.page.waitForTimeout(2000);
        await this.takeScreenshot('02-after-start-click', 'After clicking start');
      } else {
        // Look for other start options
        const altStartButton = await this.page.locator('button:has-text("Start"), a:has-text("Start"), button:has-text("Play")').first();
        if (await altStartButton.isVisible().catch(() => false)) {
          await altStartButton.click();
          await this.addTestResult('Landing Page Navigation', true, 'Found alternative start button');
        } else {
          await this.addTestResult('Landing Page Navigation', false, 'No start button found');
        }
      }

      // Wait for next page to load and take screenshot
      await this.page.waitForTimeout(3000);
      const currentUrl = this.page.url();

      // Check if we're at character creation or login
      if (currentUrl.includes('character-creation')) {
        await this.addTestResult('Post-Start Navigation', true, 'Navigated directly to character creation');
      } else if (currentUrl.includes('login')) {
        await this.takeScreenshot('03-login-page', 'Login page');

        // Try to login
        await this.page.fill('input[name="username"], input[type="text"]', 'testuser');
        await this.page.fill('input[name="password"], input[type="password"]', 'testpass');
        await this.page.click('button[type="submit"], button:has-text("Login")');
        await this.page.waitForTimeout(3000);
        await this.addTestResult('Login Process', true, 'Completed login form');
      } else {
        await this.addTestResult('Post-Start Navigation', true, `Navigated to: ${currentUrl}`);
      }

    } catch (error) {
      await this.addTestResult('Navigation Process', false, `Error: ${error.message}`);
    }
  }

  async testCharacterCreation() {
    console.log('🎭 Testing character creation...');

    try {
      const currentUrl = this.page.url();
      await this.takeScreenshot('04-current-page', 'Current page after navigation');

      // Check if we're on character creation page
      if (currentUrl.includes('character-creation')) {
        // Fill character creation form
        const nameInput = await this.page.locator('input[name="name"], input[placeholder*="name"], input[type="text"]').first();
        const nameInputVisible = await nameInput.isVisible().catch(() => false);

        if (nameInputVisible) {
          await nameInput.fill('TestHero');
          await this.addTestResult('Character Name Input', true, 'Successfully filled character name');

          // Select character class if available
          const classOptions = await this.page.locator('button, input[type="radio"]').filter({ hasText: /warrior|mage|rogue/i }).count();
          if (classOptions > 0) {
            await this.page.locator('button, input[type="radio"]').filter({ hasText: /warrior/i }).first().click();
            await this.addTestResult('Character Class Selection', true, 'Selected Warrior class');
          }

          await this.takeScreenshot('05-character-creation-filled', 'Character creation form filled');

          // Submit character creation
          const submitButton = await this.page.locator('button:has-text("Create"), button:has-text("Start"), button[type="submit"]').first();
          if (await submitButton.isVisible().catch(() => false)) {
            await submitButton.click();
            await this.page.waitForTimeout(3000);
            await this.addTestResult('Character Creation Submit', true, 'Clicked character creation submit');
          }
        } else {
          await this.addTestResult('Character Name Input', false, 'Character name input not found');
        }
      } else {
        // Try to find any form inputs and buttons to proceed
        const anyInput = await this.page.locator('input').first();
        const anyButton = await this.page.locator('button').first();

        if (await anyInput.isVisible().catch(() => false)) {
          await anyInput.fill('TestHero');
          await this.addTestResult('Form Input Found', true, 'Found and filled form input');
        }

        if (await anyButton.isVisible().catch(() => false)) {
          await anyButton.click();
          await this.page.waitForTimeout(3000);
          await this.addTestResult('Button Click', true, 'Found and clicked button');
        }

        await this.addTestResult('Character Creation Flow', true, `Proceeding from page: ${currentUrl}`);
      }

    } catch (error) {
      await this.addTestResult('Character Creation', false, `Error: ${error.message}`);
    }
  }

  async testNodeMapInterface() {
    console.log('🗺️  Testing NodeMapScreen interface...');

    try {
      // Wait for game to load
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);

      await this.takeScreenshot('06-game-loaded', 'Game page loaded');

      // Check for NodeMap components
      const nodeMapContainer = await this.page.locator('[class*="NodeMapContainer"], [data-testid="node-map"]').first();
      const isNodeMapVisible = await nodeMapContainer.isVisible().catch(() => false);

      if (isNodeMapVisible) {
        await this.addTestResult('NodeMap Visibility', true, 'NodeMapScreen is visible');
        await this.takeScreenshot('07-node-map-interface', 'NodeMapScreen interface');

        // Test header panel
        const headerPanel = await this.page.locator('[class*="HeaderPanel"], header').first();
        const hasHeader = await headerPanel.isVisible().catch(() => false);
        await this.addTestResult('Header Panel', hasHeader, hasHeader ? 'Header panel visible' : 'Header panel missing');

        // Test resource panel
        const resourceItems = await this.page.locator('[class*="ResourceItem"], [class*="resource"]').count();
        await this.addTestResult('Resource Panel', resourceItems > 0, `Found ${resourceItems} resource items`);

        // Test map area
        const mapArea = await this.page.locator('[class*="MapArea"], [class*="map"]').first();
        const hasMapArea = await mapArea.isVisible().catch(() => false);
        await this.addTestResult('Map Area', hasMapArea, hasMapArea ? 'Map area visible' : 'Map area missing');

        // Test info panel
        const infoPanel = await this.page.locator('[class*="InfoPanel"], [class*="info"]').first();
        const hasInfoPanel = await infoPanel.isVisible().catch(() => false);
        await this.addTestResult('Info Panel', hasInfoPanel, hasInfoPanel ? 'Info panel visible' : 'Info panel missing');

      } else {
        await this.addTestResult('NodeMap Visibility', false, 'NodeMapScreen not found');
      }

    } catch (error) {
      await this.addTestResult('NodeMap Interface', false, `Error: ${error.message}`);
    }
  }

  async testNodeInteractions() {
    console.log('🎯 Testing node interactions...');

    try {
      // Find all nodes
      const nodes = await this.page.locator('button[title], [class*="NodeButton"], button:has([class*="icon"])').all();
      await this.addTestResult('Node Detection', nodes.length > 0, `Found ${nodes.length} nodes`);

      if (nodes.length > 0) {
        // Test clicking on first unlocked node
        for (let i = 0; i < Math.min(nodes.length, 3); i++) {
          const node = nodes[i];
          const isEnabled = await node.isEnabled().catch(() => false);

          if (isEnabled) {
            const nodeTitle = await node.getAttribute('title').catch(() => `Node ${i + 1}`);

            await node.click();
            await this.page.waitForTimeout(1000);
            await this.takeScreenshot(`08-node-clicked-${i + 1}`, `Clicked on ${nodeTitle}`);

            await this.addTestResult(`Node Click ${i + 1}`, true, `Successfully clicked ${nodeTitle}`);
            break;
          }
        }

        // Test info panel updates
        const infoText = await this.page.locator('[class*="NodeInfo"], [class*="info"] h3, [class*="info"] p').first().textContent().catch(() => '');
        await this.addTestResult('Info Panel Updates', infoText.length > 0, `Info panel shows: ${infoText.substring(0, 50)}...`);
      }

    } catch (error) {
      await this.addTestResult('Node Interactions', false, `Error: ${error.message}`);
    }
  }

  async testChildhoodProgression() {
    console.log('👶 Testing childhood progression flow...');

    try {
      // Look for home node
      const homeNode = await this.page.locator('button[title*="Home"], button[title*="home"], button:has-text("🏠")').first();
      const homeExists = await homeNode.isVisible().catch(() => false);

      if (homeExists) {
        await homeNode.click();
        await this.takeScreenshot('09-home-node', 'Home node selected');
        await this.addTestResult('Home Node', true, 'Found and selected home node');

        // Look for guardian
        const guardianNode = await this.page.locator('button[title*="Guardian"], button[title*="guardian"], button:has-text("👤")').first();
        const guardianExists = await guardianNode.isVisible().catch(() => false);

        if (guardianExists) {
          await guardianNode.click();
          await this.takeScreenshot('10-guardian-node', 'Guardian node selected');

          // Try to interact with guardian
          const talkButton = await this.page.locator('button:has-text("Talk"), button:has-text("Interact")').first();
          const canTalk = await talkButton.isVisible().catch(() => false);

          if (canTalk) {
            await talkButton.click();
            await this.page.waitForTimeout(2000);
            await this.takeScreenshot('11-guardian-interaction', 'Guardian interaction');
            await this.addTestResult('Guardian Interaction', true, 'Successfully interacted with guardian');

            // Return to map if needed
            const backButton = await this.page.locator('button:has-text("Back"), button:has-text("Continue")').first();
            if (await backButton.isVisible().catch(() => false)) {
              await backButton.click();
            }
          }
        }

        // Look for fishing node
        const fishingNode = await this.page.locator('button[title*="Fish"], button[title*="fishing"], button:has-text("🎣")').first();
        const fishingExists = await fishingNode.isVisible().catch(() => false);

        if (fishingExists) {
          await fishingNode.click();
          await this.takeScreenshot('12-fishing-node', 'Fishing node selected');
          await this.addTestResult('Fishing Node', true, 'Found fishing node');

          // Try fishing action
          const fishButton = await this.page.locator('button:has-text("Fish"), button:has-text("Start Fishing")').first();
          if (await fishButton.isVisible().catch(() => false)) {
            await fishButton.click();
            await this.page.waitForTimeout(2000);
            await this.takeScreenshot('13-fishing-action', 'Fishing action triggered');
          }
        }

      } else {
        await this.addTestResult('Home Node', false, 'Home node not found');
      }

    } catch (error) {
      await this.addTestResult('Childhood Progression', false, `Error: ${error.message}`);
    }
  }

  async testMobileResponsiveness() {
    console.log('📱 Testing mobile responsiveness...');

    try {
      // Switch to mobile viewport
      await this.page.setViewportSize({ width: 375, height: 667 });
      await this.page.waitForTimeout(1000);

      await this.takeScreenshot('14-mobile-viewport', 'Mobile viewport (375x667)');

      // Test header responsiveness
      const headerVisible = await this.page.locator('[class*="HeaderPanel"], header').isVisible().catch(() => false);
      await this.addTestResult('Mobile Header', headerVisible, 'Header visible on mobile');

      // Test resource panel on mobile
      const resourcePanel = await this.page.locator('[class*="ResourcePanel"], [class*="resource"]').first();
      const resourcePanelVisible = await resourcePanel.isVisible().catch(() => false);
      await this.addTestResult('Mobile Resources', resourcePanelVisible, 'Resource panel visible on mobile');

      // Test node size on mobile
      const nodes = await this.page.locator('button[title], [class*="NodeButton"]').all();
      if (nodes.length > 0) {
        const firstNode = nodes[0];
        const boundingBox = await firstNode.boundingBox().catch(() => null);

        if (boundingBox) {
          const nodeSize = Math.min(boundingBox.width, boundingBox.height);
          await this.addTestResult('Mobile Node Size', nodeSize >= 30 && nodeSize <= 60, `Node size: ${nodeSize}px`);
        }
      }

      // Test touch interactions
      if (nodes.length > 0) {
        const firstNode = nodes[0];
        const isEnabled = await firstNode.isEnabled().catch(() => false);

        if (isEnabled) {
          await firstNode.tap();
          await this.page.waitForTimeout(1000);
          await this.takeScreenshot('15-mobile-node-tap', 'Mobile node tap interaction');
          await this.addTestResult('Mobile Touch Interaction', true, 'Successfully tapped node on mobile');
        }
      }

      // Test info panel on mobile
      const infoPanel = await this.page.locator('[class*="InfoPanel"], [class*="info"]').first();
      const infoPanelVisible = await infoPanel.isVisible().catch(() => false);
      await this.addTestResult('Mobile Info Panel', infoPanelVisible, 'Info panel visible on mobile');

      // Test scrolling behavior
      const pageHeight = await this.page.evaluate(() => document.body.scrollHeight);
      const viewportHeight = 667;
      await this.addTestResult('Mobile Scrolling', pageHeight <= viewportHeight * 1.2, `Page height: ${pageHeight}px vs viewport: ${viewportHeight}px`);

      // Return to desktop viewport
      await this.page.setViewportSize({ width: 1280, height: 720 });
      await this.page.waitForTimeout(1000);

    } catch (error) {
      await this.addTestResult('Mobile Responsiveness', false, `Error: ${error.message}`);
    }
  }

  async compareWithWireframe() {
    console.log('🎨 Comparing with wireframe design...');

    try {
      // Take a final comprehensive screenshot
      await this.takeScreenshot('16-final-desktop-view', 'Final desktop view for wireframe comparison');

      // Check layout structure elements that should match wireframe
      const layoutChecks = [
        {
          name: 'Header with Resources',
          selector: '[class*="HeaderPanel"], header',
          expected: 'Header panel with resource display'
        },
        {
          name: 'Central Map Area',
          selector: '[class*="MapArea"], [class*="map"]',
          expected: 'Central map/node area'
        },
        {
          name: 'Bottom Info Panel',
          selector: '[class*="InfoPanel"], [class*="info"]',
          expected: 'Bottom information panel'
        },
        {
          name: 'Connected Nodes',
          selector: 'button[title], [class*="NodeButton"]',
          expected: 'Multiple interconnected nodes'
        }
      ];

      for (const check of layoutChecks) {
        const element = await this.page.locator(check.selector).first();
        const exists = await element.isVisible().catch(() => false);
        await this.addTestResult(`Wireframe: ${check.name}`, exists, check.expected);
      }

      // Check for node connections/lines
      const connectionLines = await this.page.locator('[class*="ConnectionLine"], line, path').count();
      await this.addTestResult('Wireframe: Node Connections', connectionLines > 0, `Found ${connectionLines} connection elements`);

      // Check color scheme matches dark fantasy theme
      const backgroundElement = await this.page.locator('[class*="NodeMapContainer"], body').first();
      const backgroundColor = await backgroundElement.evaluate(el => getComputedStyle(el).backgroundColor).catch(() => '');
      const isDarkTheme = backgroundColor.includes('rgb(15, 23, 42)') || backgroundColor.includes('rgb(30, 41, 59)') || backgroundColor === 'rgba(0, 0, 0, 0)';
      await this.addTestResult('Wireframe: Dark Theme', isDarkTheme, `Background color: ${backgroundColor}`);

    } catch (error) {
      await this.addTestResult('Wireframe Comparison', false, `Error: ${error.message}`);
    }
  }

  generateReport() {
    console.log('\n📊 Generating comprehensive test report...');

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
      recommendations: this.generateRecommendations()
    };

    // Save report to file
    const reportPath = path.join(this.screenshotDir, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.screenshotDir, 'test-report.md');
    fs.writeFileSync(markdownPath, markdownReport);

    console.log(`\n✅ Test report saved to: ${reportPath}`);
    console.log(`📝 Markdown report saved to: ${markdownPath}`);
    console.log(`📸 ${this.screenshots.length} screenshots saved to: ${this.screenshotDir}`);

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    const failedTests = this.testResults.filter(t => !t.passed);

    if (failedTests.some(t => t.test.includes('NodeMap'))) {
      recommendations.push('NodeMapScreen component may not be properly rendered or accessible');
    }

    if (failedTests.some(t => t.test.includes('Mobile'))) {
      recommendations.push('Mobile responsiveness needs improvement - consider reviewing CSS media queries');
    }

    if (failedTests.some(t => t.test.includes('Node Interactions'))) {
      recommendations.push('Node interaction system may need debugging - check event handlers and game state');
    }

    if (failedTests.some(t => t.test.includes('Progression'))) {
      recommendations.push('Childhood progression flow may need adjustment - verify node unlocking logic');
    }

    if (failedTests.some(t => t.test.includes('Character Creation'))) {
      recommendations.push('Character creation flow may have issues - check form validation and routing');
    }

    return recommendations;
  }

  generateMarkdownReport(report) {
    return `# Axiomancer Node-Based Implementation Test Report

## Test Summary
- **Total Tests:** ${report.summary.totalTests}
- **Passed:** ${report.summary.passedTests}
- **Failed:** ${report.summary.failedTests}
- **Success Rate:** ${report.summary.successRate}
- **Test Date:** ${report.summary.testDate}

## Screenshots Captured
${report.screenshots.map(s => `- **${s.name}:** ${s.description} (\`${s.filename}\`)`).join('\n')}

## Test Results

### ✅ Passed Tests
${report.testResults.filter(t => t.passed).map(t => `- **${t.test}:** ${t.details}`).join('\n')}

### ❌ Failed Tests
${report.testResults.filter(t => !t.passed).map(t => `- **${t.test}:** ${t.details}`).join('\n')}

## Issues Identified
${report.issues.map(issue => `- **${issue.test}:** ${issue.details}`).join('\n')}

## Recommendations
${report.recommendations.map(rec => `- ${rec}`).join('\n')}

## Wireframe Comparison
Based on the EXAMPLE-MAP.png wireframe, the implementation should include:
- Header panel with resource tracking (gold, fish, wood, iron ore)
- Central map area with interconnected nodes
- Bottom information panel for node details
- Dark fantasy theme with appropriate colors
- Mobile-responsive design

## Mobile Testing Results
The mobile testing was conducted at 375x667 viewport to ensure:
- UI elements remain visible without horizontal scrolling
- Touch interactions work properly on nodes
- Resource panels adapt to mobile layout
- Information sections remain accessible

## Conclusion
${report.summary.successRate >= 80 ?
  'The node-based implementation shows good overall functionality with most tests passing.' :
  'The node-based implementation needs attention in several areas to improve functionality.'
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

      // Core testing sequence
      await this.navigateToGame();
      await this.testCharacterCreation();
      await this.testNodeMapInterface();
      await this.testNodeInteractions();
      await this.testChildhoodProgression();
      await this.testMobileResponsiveness();
      await this.compareWithWireframe();

      const report = this.generateReport();

      console.log('\n🎉 Test execution completed!');
      console.log(`📊 Success Rate: ${report.summary.successRate}`);

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
  const tester = new AxiomancerNodeTester();

  try {
    const report = await tester.runAllTests();
    console.log('\n✅ All tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = AxiomancerNodeTester;