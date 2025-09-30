/**
 * Authentication Testing Utilities
 * Reusable functions for login, registration, and logout flows
 */

class AuthHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Register a new user account
   */
  async registerUser(userData = {}) {
    const defaultUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test.${Date.now()}@example.com`,
      password: 'testpassword123'
    };

    const user = { ...defaultUser, ...userData };

    // Navigate to registration
    await this.page.click('text=Get Started');
    await this.page.click('text=Sign up here');

    // Fill registration form
    await this.page.fill('input[name="firstName"]', user.firstName);
    await this.page.fill('input[name="lastName"]', user.lastName);
    await this.page.fill('input[name="email"]', user.email);
    await this.page.fill('input[name="password"]', user.password);

    // Submit registration
    await this.page.click('button[type="submit"]');

    // Wait for success
    await this.page.waitForSelector('[data-testid="character-selection"], [data-testid="character-creation"]', { timeout: 10000 });

    return user;
  }

  /**
   * Login with existing credentials
   */
  async loginUser(email, password) {
    // Navigate to login
    await this.page.click('text=Get Started');

    // Fill login form
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);

    // Submit login
    await this.page.click('button[type="submit"]');

    // Wait for success
    await this.page.waitForSelector('[data-testid="character-selection"], [data-testid="character-creation"]', { timeout: 10000 });
  }

  /**
   * Logout current user
   */
  async logoutUser() {
    // Look for logout button in various possible locations
    const logoutSelectors = [
      'button:has-text("Logout")',
      'text=Logout',
      '[data-testid="logout-button"]'
    ];

    for (const selector of logoutSelectors) {
      try {
        await this.page.click(selector, { timeout: 3000 });
        break;
      } catch (e) {
        // Continue to next selector
      }
    }

    // Wait for redirect to landing page
    await this.page.waitForSelector('text=Get Started', { timeout: 5000 });
  }

  /**
   * Check if user is currently logged in
   */
  async isLoggedIn() {
    try {
      // Check for elements that only appear when logged in
      await this.page.waitForSelector('[data-testid="character-selection"], [data-testid="game-interface"]', { timeout: 2000 });
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = { AuthHelpers };