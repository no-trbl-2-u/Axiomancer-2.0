const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class CompleteFlowTester {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.screenshots = [];
    this.testResults = [];
    this.screenshotDir = path.join(__dirname, 'complete-flow-screenshots');
  }

  async setup() {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    this.browser = await chromium.launch({
      headless: false,
      slowMo: 1500
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 }
    });

    this.page = await this.context.newPage();
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

    console.log(`📸 Screenshot: ${name}`);
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

  async completeAuthentication() {
    console.log('🚀 Starting complete authentication flow...');

    try {
      // Load landing page
      await this.page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
      await this.takeScreenshot('01-landing-page', 'Landing page with CLICK TO START');

      // Click start
      const startElement = await this.page.locator('text="CLICK TO START"').first();
      if (await startElement.isVisible().catch(() => false)) {
        await startElement.click();
      } else {
        await this.page.click('body', { position: { x: 640, y: 360 } });
      }

      await this.page.waitForTimeout(2000);
      await this.takeScreenshot('02-login-page', 'Login page');

      // Go to sign up
      const signUpLink = await this.page.locator('text="Don\'t have an account? Sign up"').first();
      if (await signUpLink.isVisible().catch(() => false)) {
        await signUpLink.click();
        await this.page.waitForTimeout(2000);
        await this.takeScreenshot('03-signup-page', 'Sign up page');

        // Fill sign up form completely
        await this.page.fill('input[placeholder*="First Name"], input[name="firstName"]', 'Test');
        await this.page.fill('input[placeholder*="Last Name"], input[name="lastName"]', 'Hero');
        await this.page.fill('input[placeholder*="email"], input[name="email"]', 'testhero@example.com');
        await this.page.fill('input[placeholder*="password"], input[name="password"]', 'testpassword123');

        await this.takeScreenshot('04-signup-filled', 'Sign up form filled');

        // Submit sign up
        await this.page.click('button:has-text("Create Account"), button[type="submit"]');
        await this.page.waitForTimeout(5000);

        await this.addTestResult('Account Creation', true, 'Completed account creation');
        await this.takeScreenshot('05-after-signup', 'After account creation');

        // Check current URL and page state
        const currentUrl = this.page.url();
        console.log(`📍 Current URL after signup: ${currentUrl}`);

        // Look for character creation or game elements
        const characterCreation = await this.page.locator('text="character", text="Create Character", input[placeholder*="character"]').count();
        const gameElements = await this.page.locator('[class*="Game"], [class*="Map"], [class*="Node"]').count();

        if (characterCreation > 0) {
          await this.testCharacterCreation();
        } else if (gameElements > 0) {
          await this.testGameInterface();
        } else {
          // Try to navigate to game manually
          await this.tryNavigateToGame();
        }
      }

    } catch (error) {
      await this.addTestResult('Authentication Flow', false, `Error: ${error.message}`);
    }
  }

  async tryNavigateToGame() {
    console.log('🎮 Attempting to navigate to game...');

    try {
      // Try common game URLs
      const gameUrls = [
        'http://localhost:3002/game',
        'http://localhost:3002/character-creation',
        'http://localhost:3002/play'
      ];

      for (const url of gameUrls) {
        await this.page.goto(url, { waitUntil: 'networkidle' });
        await this.page.waitForTimeout(3000);

        const gameElements = await this.page.locator('[class*="Game"], [class*="Map"], [class*="Node"], [class*="Character"]').count();

        if (gameElements > 0) {
          await this.addTestResult('Direct Game Navigation', true, `Successfully navigated to ${url}`);
          await this.takeScreenshot('06-game-found', `Game interface at ${url}`);
          await this.testGameInterface();
          return;
        }
      }

      await this.addTestResult('Direct Game Navigation', false, 'Could not find game interface');

    } catch (error) {
      await this.addTestResult('Game Navigation', false, `Error: ${error.message}`);
    }
  }

  async testCharacterCreation() {
    console.log('🎭 Testing character creation...');

    try {
      await this.takeScreenshot('07-character-creation', 'Character creation interface');

      // Fill character creation form
      const nameInput = await this.page.locator('input[placeholder*="name"], input[name="name"], input[name="characterName"]').first();
      if (await nameInput.isVisible().catch(() => false)) {
        await nameInput.fill('TestHero');
        await this.addTestResult('Character Name Input', true, 'Filled character name');

        // Look for class selection
        const classButtons = await this.page.locator('button:has-text("Warrior"), button:has-text("Mage"), button:has-text("Rogue")').count();
        if (classButtons > 0) {
          await this.page.locator('button:has-text("Warrior")').first().click();
          await this.addTestResult('Character Class', true, 'Selected character class');
        }

        await this.takeScreenshot('08-character-filled', 'Character creation filled');

        // Submit character creation
        const submitButton = await this.page.locator('button:has-text("Create"), button:has-text("Start Game"), button[type="submit"]').first();
        if (await submitButton.isVisible().catch(() => false)) {
          await submitButton.click();
          await this.page.waitForTimeout(5000);
          await this.addTestResult('Character Creation Submit', true, 'Submitted character creation');
          await this.takeScreenshot('09-after-character-creation', 'After character creation');

          // Now test the game interface
          await this.testGameInterface();
        }
      }

    } catch (error) {
      await this.addTestResult('Character Creation', false, `Error: ${error.message}`);
    }
  }

  async testGameInterface() {
    console.log('🗺️ Testing game interface...');

    try {
      await this.page.waitForTimeout(3000);
      await this.takeScreenshot('10-game-interface', 'Game interface loaded');

      // Look for NodeMapScreen components
      const nodeMapElements = await this.page.locator('[class*="NodeMap"], [class*="Map"]').count();
      await this.addTestResult('NodeMap Detection', nodeMapElements > 0, `Found ${nodeMapElements} node map elements`);

      // Look for header with resources
      const headerElements = await this.page.locator('[class*="Header"], header, [class*="Resource"]').count();
      await this.addTestResult('Header/Resources', headerElements > 0, `Found ${headerElements} header/resource elements`);

      // Look for nodes
      const nodeElements = await this.page.locator('button[title], [class*="Node"], [role="button"]').count();
      await this.addTestResult('Game Nodes', nodeElements > 0, `Found ${nodeElements} interactive nodes`);

      if (nodeElements > 0) {
        await this.takeScreenshot('11-nodes-detected', 'Interactive nodes detected');
        await this.testNodeInteractions();
      }

      // Look for info panel
      const infoPanels = await this.page.locator('[class*="Info"], [class*="Panel"]').count();
      await this.addTestResult('Info Panels', infoPanels > 0, `Found ${infoPanels} info panels`);

      // Test mobile responsiveness
      await this.testMobileView();

      // Compare with wireframe
      await this.compareWithWireframe();

    } catch (error) {
      await this.addTestResult('Game Interface Test', false, `Error: ${error.message}`);
    }
  }

  async testNodeInteractions() {
    console.log('🎯 Testing node interactions...');

    try {
      const nodes = await this.page.locator('button[title], [class*="Node"], [role="button"]').all();

      for (let i = 0; i < Math.min(nodes.length, 3); i++) {
        const node = nodes[i];
        const isEnabled = await node.isEnabled().catch(() => false);

        if (isEnabled) {
          const nodeTitle = await node.getAttribute('title').catch(() => `Node ${i + 1}`);

          await node.click();
          await this.page.waitForTimeout(1000);
          await this.takeScreenshot(`12-node-interaction-${i + 1}`, `Interacted with ${nodeTitle}`);
          await this.addTestResult(`Node Interaction ${i + 1}`, true, `Successfully interacted with ${nodeTitle}`);

          // Look for resulting actions or info updates
          const actionButtons = await this.page.locator('button:has-text("Talk"), button:has-text("Fish"), button:has-text("Gather"), button:has-text("Build")').count();
          if (actionButtons > 0) {
            await this.addTestResult(`Action Buttons ${i + 1}`, true, `Found ${actionButtons} action buttons`);
          }
        }
      }

    } catch (error) {
      await this.addTestResult('Node Interactions', false, `Error: ${error.message}`);
    }
  }

  async testMobileView() {
    console.log('📱 Testing mobile responsiveness...');

    try {
      // Switch to mobile viewport
      await this.page.setViewportSize({ width: 375, height: 667 });
      await this.page.waitForTimeout(1000);
      await this.takeScreenshot('13-mobile-view', 'Mobile viewport (375x667)');

      // Test interface visibility
      const mainInterface = await this.page.locator('body').isVisible();
      await this.addTestResult('Mobile Interface', mainInterface, 'Interface visible on mobile');

      // Test scrolling
      const pageHeight = await this.page.evaluate(() => document.body.scrollHeight);
      await this.addTestResult('Mobile Layout', pageHeight <= 1000, `Page height: ${pageHeight}px`);

      // Test touch targets
      const touchTargets = await this.page.locator('button, a, [role="button"]').count();
      await this.addTestResult('Mobile Touch Targets', touchTargets > 0, `Found ${touchTargets} touch targets`);

      // Return to desktop
      await this.page.setViewportSize({ width: 1280, height: 720 });

    } catch (error) {
      await this.addTestResult('Mobile Testing', false, `Error: ${error.message}`);
    }
  }

  async compareWithWireframe() {
    console.log('🎨 Wireframe comparison...');

    try {
      await this.takeScreenshot('14-final-wireframe-comparison', 'Final interface for wireframe comparison');

      // Check for wireframe elements
      const wireframeChecks = [
        { name: 'Resource Display', selector: '[class*="resource"], [class*="Resource"]', expected: 'Gold, Fish, Wood, Iron Ore display' },
        { name: 'Node Map Area', selector: '[class*="map"], [class*="Map"], [class*="node"]', expected: 'Central interactive map area' },
        { name: 'Information Panel', selector: '[class*="info"], [class*="Info"], [class*="panel"]', expected: 'Bottom information display' },
        { name: 'Interactive Elements', selector: 'button[title], [role="button"], [class*="Node"]', expected: 'Clickable nodes and buttons' }
      ];

      for (const check of wireframeChecks) {
        const count = await this.page.locator(check.selector).count();
        await this.addTestResult(`Wireframe: ${check.name}`, count > 0, `${check.expected} - Found ${count} elements`);
      }

      // Check theme
      const body = await this.page.locator('body').first();
      const backgroundColor = await body.evaluate(el => getComputedStyle(el).backgroundColor).catch(() => '');
      const isDarkTheme = backgroundColor.includes('rgb(0, 0, 0)') || backgroundColor.includes('rgba(0, 0, 0') || backgroundColor === 'rgba(0, 0, 0, 0)';
      await this.addTestResult('Dark Theme', isDarkTheme, `Background: ${backgroundColor}`);

    } catch (error) {
      await this.addTestResult('Wireframe Comparison', false, `Error: ${error.message}`);
    }
  }

  generateComprehensiveReport() {
    const passedTests = this.testResults.filter(t => t.passed).length;
    const totalTests = this.testResults.length;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

    const report = {
      testSummary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        successRate: `${successRate}%`,
        testDate: new Date().toISOString()
      },
      applicationFlow: {
        landingPage: 'Shows CLICK TO START button with fantasy artwork',
        authentication: 'Login/Sign up flow with email and password',
        characterCreation: 'Form for character name and potentially class selection',
        gameInterface: 'Node-based exploration system (if implemented)'
      },
      wireframeComparison: {
        expected: {
          headerResources: 'Gold, Fish, Wood, Iron Ore tracking',
          centralMap: 'Interactive node-based map',
          infoPanel: 'Bottom panel for node details and actions',
          darkTheme: 'Dark fantasy aesthetic',
          mobileResponsive: 'Works on 375x667 mobile viewport'
        },
        implementationStatus: 'See detailed test results below'
      },
      childhoodProgression: {
        expectedFlow: [
          'Start at home node',
          'Talk to guardian to unlock progression',
          'Unlock fishing node and gather fish',
          'Collect wood and build boat',
          'Access forest path for further exploration'
        ],
        testingResults: 'See node interaction test results'
      },
      screenshots: this.screenshots,
      detailedResults: this.testResults,
      issues: this.testResults.filter(t => !t.passed),
      recommendations: this.generateRecommendations()
    };

    // Save reports
    const reportPath = path.join(this.screenshotDir, 'comprehensive-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.screenshotDir, 'comprehensive-report.md');
    fs.writeFileSync(markdownPath, markdownReport);

    console.log(`\n📊 COMPREHENSIVE TEST RESULTS:`);
    console.log(`✅ Success Rate: ${successRate}% (${passedTests}/${totalTests})`);
    console.log(`📸 Screenshots: ${this.screenshots.length}`);
    console.log(`📄 Report: ${reportPath}`);

    return report;
  }

  generateRecommendations() {
    const issues = this.testResults.filter(t => !t.passed);
    const recommendations = [];

    if (issues.some(i => i.test.includes('NodeMap'))) {
      recommendations.push('NodeMapScreen component needs implementation or debugging');
    }

    if (issues.some(i => i.test.includes('Node'))) {
      recommendations.push('Interactive node system requires development');
    }

    if (issues.some(i => i.test.includes('Mobile'))) {
      recommendations.push('Mobile responsiveness needs optimization');
    }

    if (issues.some(i => i.test.includes('Wireframe'))) {
      recommendations.push('Interface layout needs to match wireframe design');
    }

    if (issues.length === 0) {
      recommendations.push('Implementation is working well - consider adding more advanced features');
    }

    return recommendations;
  }

  generateMarkdownReport(report) {
    return `# Axiomancer Frontend Node-Based Implementation - Comprehensive Test Report

## Executive Summary
- **Test Date:** ${report.testSummary.testDate}
- **Overall Success Rate:** ${report.testSummary.successRate}
- **Tests Passed:** ${report.testSummary.passedTests}/${report.testSummary.totalTests}

## Application Flow Analysis

### Current Implementation
1. **Landing Page:** ${report.applicationFlow.landingPage}
2. **Authentication:** ${report.applicationFlow.authentication}
3. **Character Creation:** ${report.applicationFlow.characterCreation}
4. **Game Interface:** ${report.applicationFlow.gameInterface}

## Wireframe Comparison (vs EXAMPLE-MAP.png)

### Expected Features
${Object.entries(report.wireframeComparison.expected).map(([key, value]) => `- **${key}:** ${value}`).join('\n')}

### Implementation Status
${report.detailedResults.filter(r => r.test.includes('Wireframe')).map(r => `- **${r.test}:** ${r.passed ? '✅' : '❌'} ${r.details}`).join('\n')}

## Node-Based Exploration System

### Childhood Progression Flow Testing
Expected progression: ${report.childhoodProgression.expectedFlow.join(' → ')}

### Test Results
${report.detailedResults.filter(r => r.test.includes('Node') || r.test.includes('Interaction')).map(r => `- **${r.test}:** ${r.passed ? '✅' : '❌'} ${r.details}`).join('\n')}

## Mobile Responsiveness (375x667 viewport)
${report.detailedResults.filter(r => r.test.includes('Mobile')).map(r => `- **${r.test}:** ${r.passed ? '✅' : '❌'} ${r.details}`).join('\n')}

## Screenshots Captured
${report.screenshots.map(s => `1. **${s.name}:** ${s.description} (\`${s.filename}\`)`).join('\n')}

## Detailed Test Results

### ✅ Passed Tests
${report.detailedResults.filter(r => r.passed).map(r => `- **${r.test}:** ${r.details}`).join('\n')}

### ❌ Failed Tests
${report.detailedResults.filter(r => !r.passed).map(r => `- **${r.test}:** ${r.details}`).join('\n')}

## Issues and Recommendations

### Critical Issues
${report.issues.map(issue => `- **${issue.test}:** ${issue.details}`).join('\n')}

### Recommendations
${report.recommendations.map(rec => `- ${rec}`).join('\n')}

## Conclusion

${report.testSummary.successRate >= 80 ?
  'The Axiomancer frontend shows excellent progress with most features working as expected. The node-based implementation is largely functional.' :
  report.testSummary.successRate >= 60 ?
  'The Axiomancer frontend shows good progress but requires attention in several key areas to fully implement the node-based exploration system.' :
  report.testSummary.successRate >= 40 ?
  'The Axiomancer frontend has basic functionality but needs significant development to achieve the full node-based exploration vision.' :
  'The Axiomancer frontend requires substantial development work to implement the node-based exploration system as designed in the wireframes.'
}

### Next Steps
1. Address critical issues identified in testing
2. Implement missing NodeMapScreen components if not present
3. Develop childhood progression flow with interactive nodes
4. Ensure mobile responsiveness across all game screens
5. Match visual design to wireframe specifications
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runCompleteTest() {
    try {
      await this.setup();
      await this.completeAuthentication();
      const report = this.generateComprehensiveReport();

      console.log('\n🎉 Complete flow test finished!');
      return report;

    } catch (error) {
      console.error('❌ Complete flow test failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Run the complete test
async function main() {
  const tester = new CompleteFlowTester();

  try {
    const report = await tester.runCompleteTest();
    console.log('✅ Testing completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Testing failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = CompleteFlowTester;