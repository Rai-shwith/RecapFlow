// Color palette for RecapFlow - Updated to match landing page theme
export const colors = {
  // Primary colors matching landing page
  primary: '#2563eb',      // blue-600
  primaryDark: '#1d4ed8',  // blue-700
  secondary: '#7c3aed',    // purple-600
  secondaryDark: '#6d28d9', // purple-700
  
  // Legacy colors (keeping for compatibility)
  gold: '#e5cb6c',
  brown: '#946b50',
  darkBrown: '#60412d',
  beige: '#bca99e',
  darkPurple: '#4d4246',
  
  // Modern theme colors
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  }
};

// Utility functions for color variations
export const getColorWithOpacity = (color: string, opacity: number): string => 
  `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;

export const colorVariants = {
  primary: {
    10: `${colors.primary}1A`, // 10% opacity
    20: `${colors.primary}33`, // 20% opacity
    40: `${colors.primary}66`, // 40% opacity
    50: `${colors.primary}80`, // 50% opacity
  },
  secondary: {
    10: `${colors.secondary}1A`,
    20: `${colors.secondary}33`,
  }
};
