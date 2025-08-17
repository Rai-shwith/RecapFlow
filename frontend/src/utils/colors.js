// Color palette for RecapFlow
export const colors = {
  gold: '#e5cb6c',
  brown: '#946b50',
  darkBrown: '#60412d',
  beige: '#bca99e',
  darkPurple: '#4d4246'
}

// Utility functions for color variations
export const getColorWithOpacity = (color, opacity) => `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`

export const colorVariants = {
  gold: {
    10: `${colors.gold}1A`, // 10% opacity
    20: `${colors.gold}33`, // 20% opacity
    40: `${colors.gold}66`, // 40% opacity
    50: `${colors.gold}80`, // 50% opacity
  },
  beige: {
    10: `${colors.beige}1A`,
    20: `${colors.beige}33`,
  }
}
