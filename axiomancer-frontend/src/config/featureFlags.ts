/**
 * Feature Flags Configuration
 *
 * Centralized configuration for feature toggles across the application.
 * Modify these values to enable/disable specific features.
 */

export const featureFlags = {
  /**
   * Mobile-First Layout Feature Flag
   *
   * When true: Renders mobile-optimized layouts first, then scales up for desktop
   * When false: Renders desktop layouts first, then scales down for mobile
   *
   * Default: true
   */
  MOBILE_FIRST_FEATURE_FLAG: true,

  /**
   * Debug Mode
   *
   * When true: Shows debug panels and additional developer information
   * When false: Hides all debug UI elements
   *
   * Default: false (can be toggled in-game)
   */
  ENABLE_DEBUG_MODE: true,

  /**
   * Animations
   *
   * When true: Enables all UI animations (hover, pulse, glow effects)
   * When false: Disables animations for performance
   *
   * Default: true
   */
  ENABLE_ANIMATIONS: true,
} as const;

export type FeatureFlags = typeof featureFlags;
