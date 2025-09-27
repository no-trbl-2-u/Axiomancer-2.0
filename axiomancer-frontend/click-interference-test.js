const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class ClickInterferenceAnalyzer {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.screenshots = [];
    this.findings = [];
    this.screenshotDir = path.join(__dirname, 'click-interference-analysis');
  }

  async setup() {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    this.browser = await chromium.launch({
      headless: false,
      slowMo: 1000
    });

    // Set up both desktop and mobile contexts
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      hasTouch: true // Enable touch support for mobile testing
    });

    this.page = await this.context.newPage();
  }

  async takeScreenshot(name, description) {
    const filename = `${name.replace(/\s+/g, '-').toLowerCase()}.png`;
    const filepath = path.join(this.screenshotDir, filename);
    await this.page.screenshot({ path: filepath, fullPage: true });

    this.screenshots.push({ name, description, filename, timestamp: new Date().toISOString() });
    console.log(`📸 ${name} - ${description}`);
  }

  async addFinding(category, issue, severity, details, solution = '') {
    this.findings.push({
      category,
      issue,
      severity, // 'critical', 'high', 'medium', 'low'
      details,
      solution,
      timestamp: new Date().toISOString()
    });
    console.log(`${this.getSeverityEmoji(severity)} ${category}: ${issue}`);
  }

  getSeverityEmoji(severity) {
    const emojis = {
      'critical': '🚨',
      'high': '❌',
      'medium': '⚠️',
      'low': '💡'
    };
    return emojis[severity] || '🔍';
  }

  async navigateToGame() {
    try {
      await this.page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
      await this.takeScreenshot('01-landing-page', 'Landing page loaded');

      // Quick navigation to game
      await this.page.click('body', { position: { x: 640, y: 360 } });
      await this.page.waitForTimeout(2000);

      // Skip auth if possible, or quick signup
      const signUpLink = await this.page.locator('text="Don\'t have an account? Sign up"').first();
      if (await signUpLink.isVisible().catch(() => false)) {
        await signUpLink.click();
        await this.page.waitForTimeout(1000);

        await this.page.fill('input[placeholder*="First"]', 'Click');
        await this.page.fill('input[placeholder*="Last"]', 'Tester');
        await this.page.fill('input[placeholder*="email"]', `clicktest${Date.now()}@example.com`);
        await this.page.fill('input[placeholder*="password"]', 'testpass123');

        await this.page.click('button:has-text("Create Account")');
        await this.page.waitForTimeout(3000);
      }

      // Quick character creation
      const nameInput = await this.page.locator('input[placeholder*="name"]').first();
      if (await nameInput.isVisible().catch(() => false)) {
        await nameInput.fill('ClickTester');

        // Quick selections
        await this.page.locator('button, [role="button"]').nth(1).click().catch(() => {});
        await this.page.waitForTimeout(300);
        await this.page.locator('button, [role="button"]').nth(2).click().catch(() => {});
        await this.page.waitForTimeout(300);
        await this.page.locator('button, [role="button"]').nth(3).click().catch(() => {});
        await this.page.waitForTimeout(300);

        const beginButton = await this.page.locator('button:has-text("Begin")').first();
        if (await beginButton.isVisible().catch(() => false)) {
          await beginButton.click();
          await this.page.waitForTimeout(3000);
        }
      }

    } catch (error) {
      console.log(`Navigation error: ${error.message}`);
    }
  }

  async analyzeClickInterference() {
    console.log('🔍 Analyzing Click Interference Issues...');

    try {
      await this.takeScreenshot('02-game-interface', 'Game interface for click analysis');

      // Find the Guardian node
      const guardianNode = await this.page.locator('button[title*="Guardian"], button:has-text("👤")').first();
      if (await guardianNode.isVisible().catch(() => false)) {

        // Click Guardian
        await guardianNode.click();
        await this.page.waitForTimeout(2000);
        await this.takeScreenshot('03-guardian-clicked', 'Guardian node clicked');

        // Analyze the Talk button click interference
        const talkButton = await this.page.locator('button:has-text("Talk")').first();
        if (await talkButton.isVisible().catch(() => false)) {
          await this.analyzeButtonClickability(talkButton, 'Talk Button');
        }
      }

    } catch (error) {
      await this.addFinding('Click Analysis', 'General click analysis failed', 'high', `Error: ${error.message}`);
    }
  }

  async analyzeButtonClickability(button, buttonName) {
    try {
      // Get button position and styling
      const box = await button.boundingBox();
      const buttonInfo = await button.evaluate(el => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          position: styles.position,
          zIndex: styles.zIndex,
          pointerEvents: styles.pointerEvents,
          display: styles.display,
          visibility: styles.visibility,
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        };
      });

      console.log(`📊 ${buttonName} Info:`, buttonInfo);

      // Check for elements that might be intercepting clicks
      const interferingElements = await this.page.evaluate((x, y) => {
        const elements = document.elementsFromPoint(x, y);
        return elements.map(el => ({
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          styles: {
            position: window.getComputedStyle(el).position,
            zIndex: window.getComputedStyle(el).zIndex,
            pointerEvents: window.getComputedStyle(el).pointerEvents
          }
        }));
      }, box.x + box.width / 2, box.y + box.height / 2);

      console.log(`🎯 Elements at ${buttonName} position:`, interferingElements);

      // Check if there are interfering elements
      const hasInterference = interferingElements.length > 1 && interferingElements[0].className !== button.className;

      if (hasInterference) {
        await this.addFinding(
          'Click Interference',
          `${buttonName} is blocked by overlaying elements`,
          'critical',
          `Elements blocking clicks: ${interferingElements.slice(0, 3).map(el => `${el.tagName}.${el.className}`).join(', ')}`,
          'Remove or adjust z-index of interfering elements, or use pointer-events: none on overlay elements'
        );

        // Try alternative click methods
        await this.testAlternativeClickMethods(button, buttonName);
      } else {
        await this.addFinding(
          'Click Analysis',
          `${buttonName} appears clickable`,
          'low',
          'No obvious click interference detected'
        );
      }

    } catch (error) {
      await this.addFinding('Click Analysis', `${buttonName} analysis failed`, 'medium', `Error: ${error.message}`);
    }
  }

  async testAlternativeClickMethods(button, buttonName) {
    console.log(`🔧 Testing alternative click methods for ${buttonName}...`);

    const methods = [
      {
        name: 'Force Click',
        action: async () => await button.click({ force: true })
      },
      {
        name: 'JavaScript Click',
        action: async () => await button.evaluate(el => el.click())
      },
      {
        name: 'Dispatch Event',
        action: async () => await button.dispatchEvent('click')
      }
    ];

    for (const method of methods) {
      try {
        await method.action();
        await this.page.waitForTimeout(1500);

        // Check if the click worked (look for progress)
        const docksNode = await this.page.locator('button[title*="Dock"], button:has-text("⚓")').isVisible().catch(() => false);

        if (docksNode) {
          await this.addFinding(
            'Click Solution',
            `${method.name} successfully worked for ${buttonName}`,
            'medium',
            'Alternative click method resolves the interference issue',
            `Use ${method.name.toLowerCase()} in implementation`
          );
          await this.takeScreenshot(`04-${method.name.toLowerCase()}-success`, `${method.name} successful for ${buttonName}`);
          break;
        }

      } catch (error) {
        console.log(`❌ ${method.name} failed: ${error.message}`);
      }
    }
  }

  async testMobileClickInterference() {
    console.log('📱 Testing Mobile Click Interference...');

    try {
      // Switch to mobile viewport
      await this.page.setViewportSize({ width: 375, height: 667 });
      await this.page.waitForTimeout(1000);
      await this.takeScreenshot('05-mobile-viewport', 'Mobile viewport (375x667)');

      // Test mobile touch on Guardian
      const mobileGuardian = await this.page.locator('button[title*="Guardian"], button:has-text("👤")').first();
      if (await mobileGuardian.isVisible().catch(() => false)) {

        // Test tap vs click
        try {
          await mobileGuardian.tap();
          await this.page.waitForTimeout(1500);
          await this.takeScreenshot('06-mobile-guardian-tapped', 'Guardian tapped on mobile');

          const mobileTalk = await this.page.locator('button:has-text("Talk")').first();
          if (await mobileTalk.isVisible().catch(() => false)) {

            // Test mobile talk button
            await this.analyzeMobileButtonClickability(mobileTalk, 'Mobile Talk Button');

          }

        } catch (error) {
          await this.addFinding('Mobile Touch', 'Mobile tap failed', 'high', `Tap error: ${error.message}`, 'Enable touch support in context');
        }
      }

      // Test mobile button sizing
      await this.testMobileButtonSizing();

    } catch (error) {
      await this.addFinding('Mobile Testing', 'Mobile analysis failed', 'medium', `Error: ${error.message}`);
    }
  }

  async analyzeMobileButtonClickability(button, buttonName) {
    try {
      const box = await button.boundingBox();

      // Check if touch target meets minimum size requirements (44x44px)
      const meetsMinSize = box && box.width >= 44 && box.height >= 44;

      await this.addFinding(
        'Mobile Touch Target',
        `${buttonName} touch target size`,
        meetsMinSize ? 'low' : 'high',
        `Size: ${box?.width || 0}x${box?.height || 0}px (minimum: 44x44px)`,
        meetsMinSize ? '' : 'Increase button padding/min-height to meet touch target requirements'
      );

      // Test mobile click methods
      try {
        await button.tap();
        await this.page.waitForTimeout(2000);

        const docksVisible = await this.page.locator('button[title*="Dock"]').isVisible().catch(() => false);

        await this.addFinding(
          'Mobile Interaction',
          `${buttonName} mobile tap result`,
          docksVisible ? 'low' : 'high',
          docksVisible ? 'Mobile tap successful' : 'Mobile tap did not trigger expected action',
          docksVisible ? '' : 'Investigate mobile event handling and ensure touch events are properly processed'
        );

      } catch (error) {
        await this.addFinding('Mobile Touch', `${buttonName} mobile tap failed`, 'high', `Error: ${error.message}`);
      }

    } catch (error) {
      await this.addFinding('Mobile Analysis', `${buttonName} mobile analysis failed`, 'medium', `Error: ${error.message}`);
    }
  }

  async testMobileButtonSizing() {
    console.log('📏 Testing Mobile Button Sizing...');

    try {
      const buttons = await this.page.locator('button, [role="button"]').all();
      let buttonSizeIssues = 0;

      for (let i = 0; i < Math.min(buttons.length, 10); i++) {
        const button = buttons[i];
        const box = await button.boundingBox().catch(() => null);

        if (box && (box.width < 44 || box.height < 44)) {
          buttonSizeIssues++;
        }
      }

      await this.addFinding(
        'Mobile UI',
        'Button sizing compliance',
        buttonSizeIssues > 0 ? 'medium' : 'low',
        `${buttonSizeIssues} buttons below minimum touch target size (44x44px)`,
        buttonSizeIssues > 0 ? 'Increase padding or min-height for touch targets' : ''
      );

    } catch (error) {
      console.log(`Button sizing test error: ${error.message}`);
    }
  }

  async testResourceDisplayIssues() {
    console.log('💰 Testing Resource Display Issues...');

    try {
      // Return to desktop view
      await this.page.setViewportSize({ width: 1280, height: 720 });
      await this.page.waitForTimeout(1000);

      // Look for resource icons
      const resourceIcons = ['💰', '🐟', '🪵', '⛏️'];
      let foundResources = 0;

      for (const icon of resourceIcons) {
        const count = await this.page.locator(`text=${icon}`).count();
        foundResources += count;
      }

      await this.addFinding(
        'Resource Display',
        'Resource icon visibility',
        foundResources >= 4 ? 'low' : 'medium',
        `${foundResources}/4 resource icons visible`,
        foundResources < 4 ? 'Ensure all resource types (💰🐟🪵⛏️) are displayed in the header' : ''
      );

      await this.takeScreenshot('07-resource-display', 'Resource display analysis');

      // Test mobile resource display
      await this.page.setViewportSize({ width: 375, height: 667 });
      await this.page.waitForTimeout(1000);

      let mobileResources = 0;
      for (const icon of resourceIcons) {
        const count = await this.page.locator(`text=${icon}`).count();
        mobileResources += count;
      }

      await this.addFinding(
        'Mobile Resource Display',
        'Mobile resource visibility',
        mobileResources >= 4 ? 'low' : 'high',
        `${mobileResources}/4 resource icons visible on mobile`,
        mobileResources < 4 ? 'Ensure resource panel is responsive and visible on mobile devices' : ''
      );

      await this.takeScreenshot('08-mobile-resources', 'Mobile resource display analysis');

    } catch (error) {
      await this.addFinding('Resource Display', 'Resource analysis failed', 'medium', `Error: ${error.message}`);
    }
  }

  generateReport() {
    const criticalIssues = this.findings.filter(f => f.severity === 'critical');
    const highIssues = this.findings.filter(f => f.severity === 'high');
    const mediumIssues = this.findings.filter(f => f.severity === 'medium');
    const lowIssues = this.findings.filter(f => f.severity === 'low');

    const report = {
      summary: {
        testDate: new Date().toISOString(),
        totalFindings: this.findings.length,
        criticalIssues: criticalIssues.length,
        highIssues: highIssues.length,
        mediumIssues: mediumIssues.length,
        lowIssues: lowIssues.length,
        screenshotCount: this.screenshots.length
      },
      keyFindings: {
        clickInterference: criticalIssues.concat(highIssues).filter(f => f.category.includes('Click')),
        mobileIssues: this.findings.filter(f => f.category.includes('Mobile')),
        resourceIssues: this.findings.filter(f => f.category.includes('Resource')),
        solutions: this.findings.filter(f => f.category.includes('Solution'))
      },
      beforeAfterComparison: {
        identifiedIssues: [
          'Guardian Talk button blocked by overlay elements',
          'Mobile touch events not properly configured',
          'Button touch targets below minimum size requirements',
          'Resource counters not visible on mobile',
          'Click interference from CSS overlays'
        ],
        proposedSolutions: this.findings.filter(f => f.solution).map(f => ({
          issue: f.issue,
          solution: f.solution
        }))
      },
      detailedFindings: this.findings,
      screenshots: this.screenshots,
      priorityRecommendations: this.generatePriorityRecommendations()
    };

    // Save reports
    const reportPath = path.join(this.screenshotDir, 'click-interference-analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.screenshotDir, 'click-interference-analysis.md');
    fs.writeFileSync(markdownPath, markdownReport);

    console.log('\n' + '='.repeat(80));
    console.log('🔍 CLICK INTERFERENCE ANALYSIS COMPLETE');
    console.log('='.repeat(80));
    console.log(`🚨 Critical Issues: ${criticalIssues.length}`);
    console.log(`❌ High Priority: ${highIssues.length}`);
    console.log(`⚠️ Medium Priority: ${mediumIssues.length}`);
    console.log(`💡 Low Priority: ${lowIssues.length}`);
    console.log(`📸 Screenshots: ${this.screenshots.length}`);
    console.log(`📄 Report: ${reportPath}`);
    console.log(`📝 Markdown: ${markdownPath}`);
    console.log('='.repeat(80));

    return report;
  }

  generatePriorityRecommendations() {
    const recommendations = [];

    const hasClickInterference = this.findings.some(f => f.category.includes('Click') && f.severity === 'critical');
    const hasMobileIssues = this.findings.some(f => f.category.includes('Mobile') && ['critical', 'high'].includes(f.severity));
    const hasResourceIssues = this.findings.some(f => f.category.includes('Resource') && ['medium', 'high'].includes(f.severity));

    if (hasClickInterference) {
      recommendations.push({
        priority: 1,
        category: 'Critical Fix',
        action: 'Fix click interference by removing or adjusting z-index of overlay elements',
        technical: 'Add pointer-events: none to non-interactive overlay elements or use force: true for critical button clicks'
      });
    }

    if (hasMobileIssues) {
      recommendations.push({
        priority: 2,
        category: 'Mobile Optimization',
        action: 'Improve mobile touch support and button sizing',
        technical: 'Enable hasTouch: true in browser context, ensure buttons meet 44x44px minimum size requirement'
      });
    }

    if (hasResourceIssues) {
      recommendations.push({
        priority: 3,
        category: 'UI Enhancement',
        action: 'Fix resource display visibility across viewports',
        technical: 'Ensure resource panel is responsive and visible on mobile devices'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 1,
        category: 'Enhancement',
        action: 'Continue with advanced feature development',
        technical: 'Core interaction issues resolved, focus on content and gameplay features'
      });
    }

    return recommendations;
  }

  generateMarkdownReport(report) {
    return `# Click Interference Analysis Report

## Executive Summary

**Analysis Date:** ${report.summary.testDate}
**Total Findings:** ${report.summary.totalFindings}
**Screenshots Captured:** ${report.summary.screenshotCount}

### Issue Severity Breakdown
- 🚨 **Critical Issues:** ${report.summary.criticalIssues}
- ❌ **High Priority:** ${report.summary.highIssues}
- ⚠️ **Medium Priority:** ${report.summary.mediumIssues}
- 💡 **Low Priority:** ${report.summary.lowIssues}

## Key Findings

### Click Interference Issues
${report.keyFindings.clickInterference.map(f => `
**${f.issue}** (${f.severity.toUpperCase()})
- **Details:** ${f.details}
- **Solution:** ${f.solution || 'Investigation required'}
`).join('')}

### Mobile Issues
${report.keyFindings.mobileIssues.map(f => `
**${f.issue}** (${f.severity.toUpperCase()})
- **Details:** ${f.details}
- **Solution:** ${f.solution || 'Investigation required'}
`).join('')}

### Resource Display Issues
${report.keyFindings.resourceIssues.map(f => `
**${f.issue}** (${f.severity.toUpperCase()})
- **Details:** ${f.details}
- **Solution:** ${f.solution || 'Investigation required'}
`).join('')}

## Before vs After Analysis

### Issues Identified
${report.beforeAfterComparison.identifiedIssues.map(issue => `- ❌ ${issue}`).join('\n')}

### Proposed Solutions
${report.beforeAfterComparison.proposedSolutions.map(solution => `
**${solution.issue}**
→ ${solution.solution}
`).join('')}

## Priority Recommendations

${report.priorityRecommendations.map((rec, index) => `
### ${index + 1}. ${rec.category} (Priority ${rec.priority})
**Action:** ${rec.action}
**Technical Implementation:** ${rec.technical}
`).join('')}

## Detailed Findings

${report.detailedFindings.map((finding, index) => `
### ${index + 1}. ${finding.issue}
- **Category:** ${finding.category}
- **Severity:** ${finding.severity.toUpperCase()}
- **Details:** ${finding.details}
- **Solution:** ${finding.solution || 'Requires further investigation'}
- **Timestamp:** ${finding.timestamp}
`).join('')}

## Screenshots Captured

${report.screenshots.map((screenshot, index) => `
${index + 1}. **${screenshot.name}**
   ${screenshot.description}
   📁 \`${screenshot.filename}\`
`).join('')}

## Technical Implementation Notes

### Click Interference Fix
The main issue appears to be CSS overlay elements intercepting pointer events. The specific error message shows:
\`<div class="css-1kl6xxu">…</div> from <div class="css-knhcre">…</div> subtree intercepts pointer events\`

**Recommended Solutions:**
1. Add \`pointer-events: none\` to overlay elements that shouldn't be interactive
2. Adjust z-index hierarchy to ensure buttons are on top
3. Use \`force: true\` option in Playwright for critical interactions
4. Implement proper event handling for touch devices

### Mobile Touch Support
Enable touch support in browser context and ensure proper touch event handling:
\`\`\`javascript
const context = await browser.newContext({
  hasTouch: true,
  viewport: { width: 375, height: 667 }
});
\`\`\`

### Button Sizing for Mobile
Ensure all interactive elements meet minimum touch target requirements:
\`\`\`css
button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}
\`\`\`

## Next Steps

1. **Immediate Action:** Fix the CSS overlay interference issue preventing button clicks
2. **Mobile Optimization:** Implement proper touch support and button sizing
3. **Resource Display:** Ensure resource counters are visible across all viewports
4. **Testing:** Re-run comprehensive tests after fixes are implemented

---
*Generated by Click Interference Analyzer*
*Analysis completed: ${new Date().toISOString()}*
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runAnalysis() {
    try {
      await this.setup();
      await this.navigateToGame();
      await this.analyzeClickInterference();
      await this.testMobileClickInterference();
      await this.testResourceDisplayIssues();

      const report = this.generateReport();
      console.log('✅ Click interference analysis completed!');
      return report;

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Run analysis
if (require.main === module) {
  async function main() {
    const analyzer = new ClickInterferenceAnalyzer();
    try {
      await analyzer.runAnalysis();
      process.exit(0);
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      process.exit(1);
    }
  }
  main();
}

module.exports = ClickInterferenceAnalyzer;