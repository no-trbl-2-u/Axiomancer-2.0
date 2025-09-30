/**
 * Character Management Testing Utilities
 * Reusable functions for character creation, saving, loading, and deletion
 */

class CharacterHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Create a new character with customizable options
   */
  async createCharacter(characterData = {}) {
    const defaultCharacter = {
      name: `TestHero${Date.now()}`,
      ethics: 'virtue_ethics', // virtue_ethics, deontology, consequentialism
      metaphysics: 'idealism', // idealism, materialism, dualism
      epistemology: 'rationalism' // rationalism, empiricism, skepticism
    };

    const character = { ...defaultCharacter, ...characterData };

    // Navigate to character creation (if not already there)
    try {
      await this.page.waitForSelector('[data-testid="character-creation"]', { timeout: 3000 });
    } catch (e) {
      // Might need to click "Create New Character" button
      await this.page.click('text=Create New Character', { timeout: 5000 });
      await this.page.waitForSelector('[data-testid="character-creation"]', { timeout: 5000 });
    }

    // Fill character name
    await this.page.fill('input[name="name"], input[placeholder*="name"]', character.name);

    // Select ethics philosophy
    await this.page.click(`[data-philosophy="${character.ethics}"], text=${character.ethics.replace('_', ' ')}`);

    // Select metaphysics philosophy
    await this.page.click(`[data-philosophy="${character.metaphysics}"], text=${character.metaphysics}`);

    // Select epistemology philosophy
    await this.page.click(`[data-philosophy="${character.epistemology}"], text=${character.epistemology}`);

    // Submit character creation
    await this.page.click('button:has-text("Create Character"), button:has-text("Begin Journey")');

    // Wait for character to be created and navigate to game
    await this.page.waitForSelector('[data-testid="game-interface"], [data-testid="main-game"]', { timeout: 10000 });

    return character;
  }

  /**
   * Load an existing character from the selection screen
   */
  async loadCharacter() {
    // Navigate to character selection if not already there
    try {
      await this.page.waitForSelector('[data-testid="character-selection"]', { timeout: 3000 });
    } catch (e) {
      // May need to navigate from elsewhere
      console.log('Already at character selection or in game');
    }

    // Look for "Continue Journey" button
    try {
      await this.page.click('button:has-text("Continue Journey")');
      await this.page.waitForSelector('[data-testid="game-interface"]', { timeout: 5000 });
      return true;
    } catch (e) {
      return false; // No saved character found
    }
  }

  /**
   * Delete current character
   */
  async deleteCharacter() {
    // Navigate to character selection
    await this.page.goto('http://localhost:3000/character-selection');
    await this.page.waitForSelector('[data-testid="character-selection"]');

    // Click delete button
    await this.page.click('button:has-text("Delete Character")');

    // Confirm deletion in modal
    await this.page.click('button:has-text("Delete"):not(:has-text("Character"))'); // The confirm button

    // Wait for character to be deleted
    await this.page.waitForSelector('text=No saved character found', { timeout: 5000 });
  }

  /**
   * Check if a character exists
   */
  async hasCharacter() {
    try {
      await this.page.goto('http://localhost:3000/character-selection');
      await this.page.waitForSelector('[data-testid="character-selection"]', { timeout: 5000 });

      // Check if character data is present
      const continueButton = await this.page.$('button:has-text("Continue Journey")');
      return continueButton !== null;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get character information from the character selection screen
   */
  async getCharacterInfo() {
    await this.page.waitForSelector('[data-testid="character-selection"]');

    try {
      const name = await this.page.textContent('.character-info .name, .character-name');
      const level = await this.page.textContent('.character-info .level, .character-level');
      const location = await this.page.textContent('.character-info .location, .character-location');

      return {
        name: name?.trim(),
        level: level?.trim(),
        location: location?.trim()
      };
    } catch (e) {
      return null; // No character data found
    }
  }

  /**
   * Navigate to character creation from various starting points
   */
  async navigateToCharacterCreation() {
    // From character selection screen
    try {
      await this.page.click('button:has-text("Create New Character")');
      await this.page.waitForSelector('[data-testid="character-creation"]');
      return;
    } catch (e) {
      // Try other navigation paths
    }

    // From login success
    try {
      await this.page.waitForSelector('text=No saved character found', { timeout: 3000 });
      await this.page.click('button:has-text("Create New Character")');
      await this.page.waitForSelector('[data-testid="character-creation"]');
      return;
    } catch (e) {
      throw new Error('Could not navigate to character creation');
    }
  }
}

module.exports = { CharacterHelpers };