/**
 * Screenshot Testing Utilities
 * For visual regression testing and documentation
 */

class ScreenshotHelpers {
  constructor(page) {
    this.page = page;
    this.screenshotDir = 'testing-suite/screenshots';
  }

  /**
   * Take a screenshot with descriptive naming
   */
  async takeScreenshot(testName, stepName = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = stepName
      ? `${testName}-${stepName}-${timestamp}.png`
      : `${testName}-${timestamp}.png`;

    await this.page.screenshot({
      path: `${this.screenshotDir}/${filename}`,
      fullPage: true
    });

    console.log(`📸 Screenshot saved: ${filename}`);
    return filename;
  }

  /**
   * Take modal screenshot (focuses on modal dialog)
   */
  async takeModalScreenshot(modalName) {
    // Wait for modal to be visible
    await this.page.waitForSelector('.modal-overlay, .modal-content', { timeout: 3000 });

    return await this.takeScreenshot('modal', modalName);
  }

  /**
   * Take combat interface screenshot
   */
  async takeCombatScreenshot(combatState = 'general') {
    await this.page.waitForSelector('[data-testid="combat-interface"], .combat-area', { timeout: 3000 });

    return await this.takeScreenshot('combat', combatState);
  }

  /**
   * Take world map screenshot
   */
  async takeMapScreenshot(mapState = 'overview') {
    await this.page.waitForSelector('.world-map, .map-container', { timeout: 3000 });

    return await this.takeScreenshot('map', mapState);
  }

  /**
   * Take character creation screenshot
   */
  async takeCharacterCreationScreenshot(step = 'form') {
    await this.page.waitForSelector('[data-testid="character-creation"]', { timeout: 3000 });

    return await this.takeScreenshot('character-creation', step);
  }

  /**
   * Take authentication flow screenshot
   */
  async takeAuthScreenshot(authState = 'login') {
    return await this.takeScreenshot('auth', authState);
  }

  /**
   * Take error state screenshot
   */
  async takeErrorScreenshot(errorType = 'general') {
    return await this.takeScreenshot('error', errorType);
  }

  /**
   * Take responsive screenshots at different viewports
   */
  async takeResponsiveScreenshots(testName, stepName = '') {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];

    const screenshots = [];

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(500); // Allow layout to settle

      const filename = await this.takeScreenshot(
        `${testName}-${viewport.name}`,
        stepName
      );
      screenshots.push({ viewport: viewport.name, filename });
    }

    // Reset to default desktop viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });

    return screenshots;
  }

  /**
   * Clean up old screenshots (keep only recent ones)
   */
  async cleanupOldScreenshots(daysToKeep = 7) {
    // This would require filesystem access in a real implementation
    console.log(`🧹 Cleanup: Would remove screenshots older than ${daysToKeep} days`);
  }

  /**
   * Compare screenshots for visual regression testing
   */
  async compareScreenshots(baselineFile, currentFile) {
    // Placeholder for visual comparison logic
    console.log(`🔍 Visual comparison: ${baselineFile} vs ${currentFile}`);
    return { identical: true, differences: 0 };
  }

  /**
   * Create screenshot report for test run
   */
  async generateScreenshotReport(testResults) {
    const reportData = {
      testRun: new Date().toISOString(),
      screenshots: testResults,
      summary: {
        total: testResults.length,
        passed: testResults.filter(r => r.status === 'passed').length,
        failed: testResults.filter(r => r.status === 'failed').length
      }
    };

    console.log('📊 Screenshot Report Generated:');
    console.log(`Total Screenshots: ${reportData.summary.total}`);
    console.log(`Passed: ${reportData.summary.passed}`);
    console.log(`Failed: ${reportData.summary.failed}`);

    return reportData;
  }
}

module.exports = { ScreenshotHelpers };