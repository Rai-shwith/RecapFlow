// Configuration utility for environment variables
// This file centralizes all environment variable access

class Config {
  // API Configuration
  static get API_BASE_URL() {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  }

  // App Configuration
  static get APP_NAME() {
    return import.meta.env.VITE_APP_NAME || 'RecapFlow'
  }

  static get APP_VERSION() {
    return import.meta.env.VITE_APP_VERSION || '1.0.0'
  }

  static get NODE_ENV() {
    return import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development'
  }

  // Helper methods
  static get isDevelopment() {
    return this.NODE_ENV === 'development'
  }

  static get isProduction() {
    return this.NODE_ENV === 'production'
  }

  // Validate required environment variables
  static validateConfig() {
    const required = ['API_BASE_URL']
    const missing = []

    for (const key of required) {
      if (!this[key]) {
        missing.push(`VITE_${key}`)
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file and ensure all required variables are set.'
      )
    }

    return true
  }
}

// Validate configuration on import
try {
  Config.validateConfig()
} catch (error) {
  console.error('Configuration Error:', error.message)
}

export default Config
