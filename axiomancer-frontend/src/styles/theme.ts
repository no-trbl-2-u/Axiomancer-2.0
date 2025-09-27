export const theme = {
  colors: {
    // Gothic Medieval Theme Colors - extracted from the Axiomancer image
    primary: '#8B0000',        // Deep crimson red from robes
    secondary: '#2F4F4F',      // Dark slate gray from stone
    accent: '#4682B4',         // Steel blue from stained glass
    success: '#228B22',        // Forest green
    danger: '#DC143C',         // Crimson
    warning: '#DAA520',        // Goldenrod from ornate details
    info: '#4682B4',           // Steel blue
    light: '#F5F5DC',          // Beige from parchment
    dark: '#1C1C1C',           // Near black from shadows
    white: '#FFFAF0',          // Floral white
    // Gothic color palette
    gothic: {
      crimson: '#8B0000',      // Deep red from robes
      stone: '#696969',        // Dim gray from stone walls
      shadow: '#2F2F2F',       // Dark charcoal
      gold: '#DAA520',         // Goldenrod from details
      silver: '#C0C0C0',       // Silver from metalwork
      midnight: '#191970',     // Midnight blue
      parchment: '#F5F5DC',    // Aged parchment
      blood: '#DC143C',        // Blood red
    },
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
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const;