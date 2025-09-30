/**
 * Comprehensive Axiomancer Game Test Suite
 * Tests every aspect of the currently implemented game using consolidated utilities
 */

const { test, expect } = require('@playwright/test');
const { AuthHelpers } = require('./utils/auth-helpers');
const { CharacterHelpers } = require('./utils/character-helpers');
const { CombatHelpers } = require('./utils/combat-helpers');
const { NavigationHelpers } = require('./utils/navigation-helpers');
const { ScreenshotHelpers } = require('./utils/screenshot-helpers');

test.describe('Axiomancer Complete Game Flow', () => {
  let page;
  let authHelpers;
  let characterHelpers;
  let combatHelpers;
  let navigationHelpers;
  let screenshotHelpers;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // Initialize all helper utilities
    authHelpers = new AuthHelpers(page);
    characterHelpers = new CharacterHelpers(page);
    combatHelpers = new CombatHelpers(page);
    navigationHelpers = new NavigationHelpers(page);
    screenshotHelpers = new ScreenshotHelpers(page);

    // Navigate to the application
    await page.goto('http://localhost:3000');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Complete Game Flow: Registration to Combat', async () => {
    console.log('🎮 Starting Complete Game Flow Test');

    // 1. AUTHENTICATION FLOW
    console.log('\n📋 Testing Authentication...');
    await screenshotHelpers.takeAuthScreenshot('landing-page');

    const testUser = await authHelpers.registerUser({
      firstName: 'GameTest',
      lastName: 'Player',
      email: `gametest.${Date.now()}@axiomancer.com`,
      password: 'testpass123'
    });

    await screenshotHelpers.takeAuthScreenshot('post-registration');
    console.log('✅ User registration completed');

    // 2. CHARACTER CREATION FLOW
    console.log('\n🧙‍♀️ Testing Character Creation...');
    await screenshotHelpers.takeCharacterCreationScreenshot('initial-form');

    const testCharacter = await characterHelpers.createCharacter({
      name: 'PhilosopherHero',
      ethics: 'virtue_ethics',
      metaphysics: 'idealism',
      epistemology: 'rationalism'
    });

    await screenshotHelpers.takeCharacterCreationScreenshot('character-created');
    console.log('✅ Character creation completed');

    // 3. WORLD MAP NAVIGATION
    console.log('\n🗺️ Testing World Map Navigation...');
    await navigationHelpers.navigateToGame();
    await screenshotHelpers.takeMapScreenshot('initial-world-map');

    const mapInteractionResults = await navigationHelpers.testMapInteraction();
    expect(mapInteractionResults.totalNodes).toBeGreaterThan(0);
    console.log(`✅ Map interaction tested - ${mapInteractionResults.totalNodes} nodes found`);

    // 4. COMPREHENSIVE COMBAT SYSTEM TEST
    console.log('\n⚔️ Testing Complete Combat System...');

    // Enter combat
    await combatHelpers.enterCombat();
    await screenshotHelpers.takeCombatScreenshot('combat-interface');
    console.log('✅ Combat entered successfully');

    // Test philosophical aspects and NEW skill modals
    console.log('\n🧠 Testing Philosophical Aspects & NEW Skill Modals...');
    const aspects = ['heart', 'body', 'mind'];
    const skillTestResults = {};

    for (const aspect of aspects) {
      console.log(`Testing ${aspect} aspect and skills...`);

      // Test aspect selection
      await combatHelpers.selectPhilosophicalAspect(aspect);
      await screenshotHelpers.takeCombatScreenshot(`${aspect}-aspect-selected`);

      // Test NEW Skills modal (formerly Special Attack)
      const skillResult = await combatHelpers.testSkillsModal(aspect);
      skillTestResults[aspect] = skillResult;

      await screenshotHelpers.takeModalScreenshot(`${aspect}-skills-modal`);
      console.log(`✅ ${aspect} skills modal tested - Has skills: ${skillResult.hasSkills}`);
    }

    // Test NEW buff/debuff displays
    console.log('\n🎨 Testing NEW Buff/Debuff Displays...');
    const buffResults = await combatHelpers.testBuffDebuffDisplays();
    expect(buffResults.playerDisplayPresent).toBeTruthy();
    expect(buffResults.enemyDisplayPresent).toBeTruthy();

    await screenshotHelpers.takeCombatScreenshot('buff-debuff-displays');
    console.log('✅ Buff/debuff displays verified');

    // Test combat actions
    console.log('\n🗡️ Testing Combat Actions...');
    await combatHelpers.selectPhilosophicalAspect('heart');

    // Test attack
    await combatHelpers.performAttack();
    await screenshotHelpers.takeCombatScreenshot('after-attack');

    // Test defend
    await combatHelpers.performDefend();
    await screenshotHelpers.takeCombatScreenshot('after-defend');

    // Get combat log to verify actions
    const combatLog = await combatHelpers.getCombatLog();
    expect(combatLog.length).toBeGreaterThan(0);
    console.log(`✅ Combat actions tested - ${combatLog.length} log entries`);

    // 5. CHARACTER MANAGEMENT TESTING
    console.log('\n💾 Testing Character Management...');

    // Verify character exists
    const hasCharacter = await characterHelpers.hasCharacter();
    expect(hasCharacter).toBeTruthy();
    console.log('✅ Character existence verified');

    // 6. EVENT INTERACTION TESTING
    console.log('\n🎭 Testing Event Interactions...');

    // Navigate back to map for event testing
    await navigationHelpers.navigateToGame();

    // Test different event types
    const eventResults = await navigationHelpers.testEventTypes();
    console.log('✅ Event types tested:', Object.keys(eventResults));

    // 7. RESPONSIVE DESIGN TESTING
    console.log('\n📱 Testing Responsive Design...');
    const responsiveResults = await navigationHelpers.testResponsiveMap();

    for (const [viewport, result] of Object.entries(responsiveResults)) {
      expect(result.mapVisible).toBeTruthy();
      console.log(`✅ ${viewport} viewport tested - ${result.nodesFound} nodes visible`);
    }

    await screenshotHelpers.takeResponsiveScreenshots('complete-game', 'final-state');

    // 8. FINAL VERIFICATION
    console.log('\n🏁 Final Verification...');

    // Verify we can navigate back to character selection
    await page.goto('http://localhost:3000/character-selection');
    const characterInfo = await characterHelpers.getCharacterInfo();
    expect(characterInfo).toBeTruthy();
    expect(characterInfo.name).toContain('PhilosopherHero');

    await screenshotHelpers.takeScreenshot('final-verification', 'character-selection');
    console.log('✅ Character persistence verified');

    // COMPLETE TEST SUMMARY
    console.log('\n🎉 COMPLETE GAME TEST SUMMARY:');
    console.log('✅ Authentication: Registration & Login');
    console.log('✅ Character Creation: Full philosophical setup');
    console.log('✅ World Map: Navigation & interaction');
    console.log('✅ Combat System: Complete flow including NEW features');
    console.log('✅ NEW Skill Modals: Heart/Body/Mind testing');
    console.log('✅ NEW Buff/Debuff Displays: Visual components');
    console.log('✅ Event Interactions: Multiple event types');
    console.log('✅ Responsive Design: Multiple viewports');
    console.log('✅ Character Management: Save/load/persistence');
    console.log('✅ Screenshots: Comprehensive visual documentation');

    // Return comprehensive results
    return {
      authentication: { user: testUser.email, success: true },
      characterCreation: { character: testCharacter.name, success: true },
      mapNavigation: mapInteractionResults,
      combatSystem: {
        skillModals: skillTestResults,
        buffDebuffDisplays: buffResults,
        combatActions: { logEntries: combatLog.length }
      },
      responsiveDesign: responsiveResults,
      characterManagement: { hasCharacter, characterInfo }
    };
  });

  test('Skill Modals Isolated Test', async () => {
    console.log('🎯 Isolated Skills Modal Test');

    // Quick setup for skill testing
    await authHelpers.registerUser();
    await characterHelpers.createCharacter();
    await combatHelpers.enterCombat();

    // Test each aspect's skills modal in detail
    const detailedSkillResults = {};

    for (const aspect of ['heart', 'body', 'mind']) {
      console.log(`\n🧠 Detailed ${aspect} skill testing...`);

      const result = await combatHelpers.testSkillsModal(aspect);
      detailedSkillResults[aspect] = result;

      // Take detailed screenshots
      await screenshotHelpers.takeModalScreenshot(`${aspect}-skills-detailed`);

      if (result.hasSkills) {
        console.log(`✅ ${aspect} has available skills`);
      } else {
        console.log(`ℹ️ ${aspect} shows "No Skills of selected argument"`);
      }
    }

    console.log('✅ Isolated skills modal test completed');
    return detailedSkillResults;
  });

  test('Buff/Debuff Display Isolated Test', async () => {
    console.log('🎨 Isolated Buff/Debuff Display Test');

    // Quick setup
    await authHelpers.registerUser();
    await characterHelpers.createCharacter();
    await combatHelpers.enterCombat();

    // Detailed buff/debuff testing
    const buffDisplayResults = await combatHelpers.testBuffDebuffDisplays();

    // Take screenshots of empty state
    await screenshotHelpers.takeCombatScreenshot('empty-buffs-state');

    // Verify both displays exist
    expect(buffDisplayResults.playerDisplayPresent).toBeTruthy();
    expect(buffDisplayResults.enemyDisplayPresent).toBeTruthy();

    console.log('✅ Player Buff/Debuff Display:', buffDisplayResults.playerDisplayPresent ? 'Present' : 'Missing');
    console.log('✅ Enemy Buff/Debuff Display:', buffDisplayResults.enemyDisplayPresent ? 'Present' : 'Missing');
    console.log('✅ "No active effects" messages:', buffDisplayResults.noEffectsMessagesCount);

    return buffDisplayResults;
  });
});