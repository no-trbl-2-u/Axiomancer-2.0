/**
 * Combat System Testing Utilities
 * Including NEW skill modals and buff/debuff displays
 */

class CombatHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Enter combat by clicking on a combat node
   */
  async enterCombat() {
    // Look for combat nodes in the game world
    const combatSelectors = [
      '[data-event-type="combat"]',
      '.node-combat',
      '.location-node:has-text("forest")',
      '.event-node[data-type="combat"]'
    ];

    for (const selector of combatSelectors) {
      try {
        await this.page.click(selector, { timeout: 3000 });
        break;
      } catch (e) {
        // Try next selector
      }
    }

    // Wait for combat interface to load
    await this.page.waitForSelector('[data-testid="combat-interface"], .combat-area', { timeout: 10000 });
  }

  /**
   * Test philosophical aspect selection (Heart/Body/Mind)
   */
  async selectPhilosophicalAspect(aspect = 'heart') {
    const aspectMap = {
      'heart': ['❤️', 'Heart', 'heart'],
      'body': ['💪', 'Body', 'body'],
      'mind': ['🧠', 'Mind', 'mind']
    };

    const selectors = aspectMap[aspect.toLowerCase()];

    for (const selector of selectors) {
      try {
        await this.page.click(`button:has-text("${selector}"), [data-aspect="${selector}"]`);
        break;
      } catch (e) {
        // Try next selector
      }
    }

    // Verify aspect is selected
    await this.page.waitForSelector(`button:has-text("${selectors[1]}")`, { timeout: 3000 });
  }

  /**
   * Test the NEW Skills modal functionality
   * This tests the renamed "Special Attack" -> "Skills" button
   */
  async testSkillsModal(aspect = 'heart') {
    // First select an aspect
    await this.selectPhilosophicalAspect(aspect);

    // Click the "Skills" button (formerly "Special Attack")
    await this.page.click('button:has-text("Skills"), button:has-text("✨ Skills")');

    // Wait for skill selection modal to appear
    await this.page.waitForSelector('[data-testid="skill-modal"], .skill-selection-modal', { timeout: 5000 });

    // Verify modal header shows correct aspect
    const expectedAspect = aspect.charAt(0).toUpperCase() + aspect.slice(1);
    await this.page.waitForSelector(`text=${expectedAspect} Skills`);

    // Check if skills are shown or "No Skills" message
    const hasSkills = await this.page.$('.skill-card, .skill-item');
    const noSkillsMessage = await this.page.$('text=No Skills of selected argument');

    if (hasSkills) {
      console.log(`✅ Skills found for ${aspect} aspect`);

      // Test skill selection
      await this.page.click('.skill-card:first-child, .skill-item:first-child');

      // Modal should close after selection
      await this.page.waitForSelector('[data-testid="skill-modal"]', { state: 'hidden', timeout: 3000 });

      return { hasSkills: true, skillSelected: true };
    } else if (noSkillsMessage) {
      console.log(`✅ "No Skills of selected argument" message shown for ${aspect}`);

      // Close modal
      await this.page.click('button:has-text("×"), .close-button');

      return { hasSkills: false, messageShown: true };
    } else {
      throw new Error(`Expected either skills or "No Skills" message for ${aspect} aspect`);
    }
  }

  /**
   * Test buff/debuff display functionality
   * Tests the NEW BuffDebuffDisplay components
   */
  async testBuffDebuffDisplays() {
    // Look for buff/debuff display containers
    const displaySelectors = [
      '[data-testid="player-buffs"]',
      '[data-testid="enemy-buffs"]',
      '.buff-debuff-display',
      ':has-text("Your Effects")',
      ':has-text("Enemy Effects")'
    ];

    let playerDisplay = null;
    let enemyDisplay = null;

    for (const selector of displaySelectors) {
      try {
        const element = await this.page.$(selector);
        if (element) {
          const text = await element.textContent();
          if (text.includes('Your Effects') || text.includes('player')) {
            playerDisplay = element;
          } else if (text.includes('Enemy Effects') || text.includes('enemy')) {
            enemyDisplay = element;
          }
        }
      } catch (e) {
        // Continue searching
      }
    }

    // Test that displays exist (even if empty)
    const hasPlayerDisplay = !!playerDisplay || await this.page.$(':has-text("Your Effects")');
    const hasEnemyDisplay = !!enemyDisplay || await this.page.$(':has-text("Enemy Effects")');

    console.log(`✅ Player buff/debuff display: ${hasPlayerDisplay ? 'Present' : 'Missing'}`);
    console.log(`✅ Enemy buff/debuff display: ${hasEnemyDisplay ? 'Present' : 'Missing'}`);

    // Check for "No active effects" message when no buffs/debuffs
    const noEffectsMessages = await this.page.$$(':has-text("No active effects")');

    return {
      playerDisplayPresent: hasPlayerDisplay,
      enemyDisplayPresent: hasEnemyDisplay,
      noEffectsMessagesCount: noEffectsMessages.length
    };
  }

  /**
   * Execute a basic attack action
   */
  async performAttack() {
    await this.page.click('button:has-text("Attack"), button:has-text("🗡️ Attack")');

    // Wait for combat log update
    await this.page.waitForTimeout(1000);
  }

  /**
   * Execute defend action
   */
  async performDefend() {
    await this.page.click('button:has-text("Defend"), button:has-text("🛡️ Defend")');

    // Wait for combat log update
    await this.page.waitForTimeout(1000);
  }

  /**
   * Attempt to flee from combat
   */
  async performFlee() {
    await this.page.click('button:has-text("Flee"), button:has-text("🏃 Flee")');

    // Wait for result
    await this.page.waitForTimeout(2000);
  }

  /**
   * Get combat log entries
   */
  async getCombatLog() {
    const logSelectors = [
      '.battle-log .log-entry',
      '.combat-log .entry',
      '[data-testid="combat-log"] .message'
    ];

    for (const selector of logSelectors) {
      try {
        const entries = await this.page.$$eval(selector, elements =>
          elements.map(el => el.textContent.trim())
        );
        if (entries.length > 0) return entries;
      } catch (e) {
        // Try next selector
      }
    }

    return [];
  }

  /**
   * Check if combat has ended
   */
  async isCombatEnded() {
    const endIndicators = [
      'text=Victory!',
      'text=Defeated!',
      'text=Event Complete',
      'button:has-text("Continue Journey")'
    ];

    for (const indicator of endIndicators) {
      try {
        await this.page.waitForSelector(indicator, { timeout: 1000 });
        return true;
      } catch (e) {
        // Continue checking
      }
    }

    return false;
  }

  /**
   * Get enemy health information
   */
  async getEnemyHealth() {
    try {
      const healthText = await this.page.textContent('.enemy-health, .monster-stats .stat-value');
      const match = healthText.match(/(\d+)\s*\/\s*(\d+)/);

      if (match) {
        return {
          current: parseInt(match[1]),
          max: parseInt(match[2])
        };
      }
    } catch (e) {
      // Health info not found
    }

    return null;
  }

  /**
   * Comprehensive combat flow test including NEW features
   */
  async runFullCombatTest() {
    console.log('🎮 Starting comprehensive combat test...');

    // Enter combat
    await this.enterCombat();
    console.log('✅ Entered combat successfully');

    // Test philosophical aspects and skills for each type
    const aspects = ['heart', 'body', 'mind'];
    const skillResults = {};

    for (const aspect of aspects) {
      console.log(`\n🧠 Testing ${aspect} aspect...`);

      // Test skills modal for this aspect
      const skillResult = await this.testSkillsModal(aspect);
      skillResults[aspect] = skillResult;

      console.log(`✅ ${aspect} skills test completed`);
    }

    // Test buff/debuff displays
    console.log('\n🎨 Testing buff/debuff displays...');
    const buffResults = await this.testBuffDebuffDisplays();

    // Perform some combat actions
    console.log('\n⚔️ Testing combat actions...');
    await this.selectPhilosophicalAspect('heart');
    await this.performAttack();

    // Get combat log
    const logEntries = await this.getCombatLog();
    console.log(`✅ Combat log has ${logEntries.length} entries`);

    // Check if combat ended or continue
    const combatEnded = await this.isCombatEnded();

    return {
      combatEntered: true,
      skillsModalTests: skillResults,
      buffDebuffDisplays: buffResults,
      combatLogEntries: logEntries.length,
      combatEnded
    };
  }
}

module.exports = { CombatHelpers };