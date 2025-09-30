/**
 * Navigation Testing Utilities
 * For map interaction, location movement, and game navigation
 */

class NavigationHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to the main game interface
   */
  async navigateToGame() {
    // Look for game interface indicators
    const gameSelectors = [
      '[data-testid="game-interface"]',
      '[data-testid="main-game"]',
      '.game-container',
      '.world-map'
    ];

    // Check if already in game
    for (const selector of gameSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 2000 });
        console.log('✅ Already in game interface');
        return;
      } catch (e) {
        // Continue checking
      }
    }

    // Try to navigate to game from various states
    try {
      // From character selection
      await this.page.click('button:has-text("Continue Journey")');
      await this.page.waitForSelector('[data-testid="game-interface"]', { timeout: 5000 });
      return;
    } catch (e) {
      // Try direct navigation
      await this.page.goto('http://localhost:3000/game');
      await this.page.waitForSelector('[data-testid="game-interface"]', { timeout: 5000 });
    }
  }

  /**
   * Find and interact with map nodes
   */
  async findMapNodes() {
    // Wait for map to load
    await this.page.waitForSelector('.world-map, .map-container, [data-testid="world-map"]', { timeout: 10000 });

    // Look for interactive nodes
    const nodeSelectors = [
      '.node',
      '.location-node',
      '.map-node',
      '[data-testid="location-node"]',
      '.event-node'
    ];

    let nodes = [];

    for (const selector of nodeSelectors) {
      try {
        const elements = await this.page.$$(selector);
        if (elements.length > 0) {
          nodes = elements;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    console.log(`✅ Found ${nodes.length} interactive nodes`);
    return nodes;
  }

  /**
   * Click on a specific type of location
   */
  async clickLocationByType(locationType = 'forest') {
    const nodes = await this.findMapNodes();

    for (const node of nodes) {
      try {
        // Check node attributes or text content
        const nodeText = await node.textContent();
        const nodeClass = await node.getAttribute('class');
        const nodeType = await node.getAttribute('data-type');

        if (nodeText?.toLowerCase().includes(locationType) ||
            nodeClass?.toLowerCase().includes(locationType) ||
            nodeType?.toLowerCase().includes(locationType)) {

          await node.click();
          console.log(`✅ Clicked ${locationType} location`);

          // Wait for event modal or location change
          await this.page.waitForTimeout(2000);
          return true;
        }
      } catch (e) {
        // Continue to next node
      }
    }

    console.log(`❌ Could not find ${locationType} location`);
    return false;
  }

  /**
   * Test interaction with different event types
   */
  async testEventTypes() {
    const eventTypes = ['combat', 'moral', 'gathering', 'rest'];
    const results = {};

    for (const eventType of eventTypes) {
      console.log(`\n🎯 Testing ${eventType} event...`);

      // Look for event node
      const found = await this.clickLocationByType(eventType);

      if (found) {
        // Wait for event modal
        const modalVisible = await this.waitForEventModal();
        results[eventType] = { found: true, modalOpened: modalVisible };

        if (modalVisible) {
          // Close modal to continue testing
          await this.closeEventModal();
        }
      } else {
        results[eventType] = { found: false, modalOpened: false };
      }
    }

    return results;
  }

  /**
   * Wait for event modal to appear
   */
  async waitForEventModal() {
    const modalSelectors = [
      '[data-testid="event-modal"]',
      '.modal-overlay',
      '.event-modal',
      '.modal-content'
    ];

    for (const selector of modalSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 3000 });
        return true;
      } catch (e) {
        // Try next selector
      }
    }

    return false;
  }

  /**
   * Close currently open event modal
   */
  async closeEventModal() {
    const closeSelectors = [
      'button:has-text("×")',
      '.close-button',
      '[data-testid="close-modal"]',
      'button:has-text("Continue Journey")'
    ];

    for (const selector of closeSelectors) {
      try {
        await this.page.click(selector, { timeout: 2000 });

        // Wait for modal to close
        await this.page.waitForTimeout(1000);
        return true;
      } catch (e) {
        // Try next selector
      }
    }

    // Try pressing Escape key
    try {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(1000);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get current location information
   */
  async getCurrentLocation() {
    try {
      // Look for location indicators
      const locationSelectors = [
        '.current-location',
        '.location-name',
        '[data-testid="current-location"]'
      ];

      for (const selector of locationSelectors) {
        try {
          const locationText = await this.page.textContent(selector);
          if (locationText) {
            return locationText.trim();
          }
        } catch (e) {
          // Try next selector
        }
      }

      return 'Unknown Location';
    } catch (e) {
      return 'Location Not Found';
    }
  }

  /**
   * Test map responsiveness and interaction
   */
  async testMapInteraction() {
    console.log('🗺️ Testing map interaction...');

    // Navigate to game
    await this.navigateToGame();

    // Find all nodes
    const nodes = await this.findMapNodes();

    // Test clicking on first few nodes
    const interactionResults = [];
    const maxNodesToTest = Math.min(3, nodes.length);

    for (let i = 0; i < maxNodesToTest; i++) {
      try {
        await nodes[i].click();

        // Check if modal opened
        const modalOpened = await this.waitForEventModal();

        interactionResults.push({
          nodeIndex: i,
          clickable: true,
          modalOpened
        });

        if (modalOpened) {
          await this.closeEventModal();
        }

        // Wait between clicks
        await this.page.waitForTimeout(1000);

      } catch (e) {
        interactionResults.push({
          nodeIndex: i,
          clickable: false,
          error: e.message
        });
      }
    }

    console.log(`✅ Tested ${interactionResults.length} nodes`);
    return {
      totalNodes: nodes.length,
      testedNodes: interactionResults.length,
      interactions: interactionResults
    };
  }

  /**
   * Test navigation breadcrumbs or location tracking
   */
  async testLocationTracking() {
    const currentLocation = await this.getCurrentLocation();

    // Click on a node to change location
    await this.clickLocationByType('forest');

    // Check if location updated
    const newLocation = await this.getCurrentLocation();

    return {
      initialLocation: currentLocation,
      finalLocation: newLocation,
      locationChanged: currentLocation !== newLocation
    };
  }

  /**
   * Test responsive map behavior
   */
  async testResponsiveMap() {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    const results = {};

    for (const viewport of viewports) {
      console.log(`📱 Testing ${viewport.name} viewport...`);

      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(1000);

      // Check if map is visible and functional
      const nodes = await this.findMapNodes();

      results[viewport.name] = {
        viewport,
        nodesFound: nodes.length,
        mapVisible: nodes.length > 0
      };
    }

    // Reset to desktop viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });

    return results;
  }
}

module.exports = { NavigationHelpers };