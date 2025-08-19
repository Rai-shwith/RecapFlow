// Configuration utility for environment variables in Next.js
// This file centralizes all environment variable access

class Config {
  // API Configuration
  static get API_BASE_URL() {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  }

  // App Configuration
  static get APP_NAME() {
    return process.env.NEXT_PUBLIC_APP_NAME || 'RecapFlow'
  }

  static get APP_VERSION() {
    return process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
  }

  static get NODE_ENV() {
    return process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || 'development'
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
    const required = ['API_BASE_URL'] as const
    const missing: string[] = []

    for (const key of required) {
      const configKey = key as keyof typeof Config
      if (!this[configKey]) {
        missing.push(`NEXT_PUBLIC_${key}`)
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.'
      )
    }

    return true
  }
}

// Validate configuration on import (only in browser)
if (typeof window !== 'undefined') {
  try {
    Config.validateConfig()
  } catch (error) {
    console.error('Configuration Error:', (error as Error).message)
  }
}

export default Config
