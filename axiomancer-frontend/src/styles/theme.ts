export const theme = {
  colors: {
    // Dark Gothic RPG Theme - inspired by medieval fantasy games
    primary: '#DAA520',        // Gold for primary elements
    secondary: '#C0C0C0',      // Silver for secondary
    accent: '#FF6B35',         // Orange-red for highlights
    success: '#228B22',        // Forest green
    danger: '#DC143C',         // Blood red for combat/health
    warning: '#FFD700',        // Gold for warnings
    info: '#4169E1',           // Royal blue for information
    light: '#F5F5DC',          // Parchment
    dark: '#000000',           // Pure black background
    white: '#FFFFFF',          // Pure white text
    // Dark RPG UI Colors
    background: {
      primary: '#000000',      // Black main background
      secondary: '#1a1a1a',    // Very dark gray
      panel: '#2a2a2a',        // Dark panel background
      modal: 'rgba(0, 0, 0, 0.9)', // Semi-transparent overlay
    },
    border: {
      primary: '#DAA520',      // Gold borders
      secondary: '#C0C0C0',    // Silver borders
      dark: '#666666',         // Dark borders
      light: '#999999',        // Light borders
    },
    text: {
      primary: '#FFFFFF',      // White primary text
      secondary: '#CCCCCC',    // Light gray secondary text
      accent: '#DAA520',       // Gold accent text
      muted: '#888888',        // Muted gray text
    },
    health: {
      high: '#DC143C',         // Blood red for health bars
      medium: '#FF4500',       // Orange-red
      low: '#8B0000',          // Dark red
      background: '#333333',   // Dark background for bars
    },
    mana: {
      high: '#4169E1',         // Royal blue for mana
      medium: '#1E90FF',       // Dodger blue
      low: '#000080',          // Navy blue
      background: '#333333',   // Dark background for bars
    },
    // Keep gray colors for compatibility
    gray: {
      100: '#F5F5DC',          // Light parchment
      200: '#E5E5E5',
      300: '#D3D3D3',
      400: '#A9A9A9',
      500: '#808080',
      600: '#696969',          // Dim gray
      700: '#556B2F',          // Dark olive
      800: '#2F2F2F',          // Dark charcoal
      900: '#1C1C1C',          // Near black
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    wide: '1200px',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '50%',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.8)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.8), 0 2px 4px -1px rgba(0, 0, 0, 0.6)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.8), 0 4px 6px -2px rgba(0, 0, 0, 0.6)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.6)',
    // RPG-style shadows for buttons and panels
    button: 'inset 0 2px 4px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.8)',
    panel: 'inset 0 0 0 2px rgba(218, 165, 32, 0.3), 0 4px 8px rgba(0, 0, 0, 0.8)',
    glow: '0 0 10px rgba(218, 165, 32, 0.5)',
  },
  // RPG UI specific styling
  rpg: {
    borderWidth: '3px',
    panelBorderRadius: '8px',
    buttonBorderRadius: '4px',
    healthBarHeight: '12px',
    manaBarHeight: '8px',
  },
} as const;