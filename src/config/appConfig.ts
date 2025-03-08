/**
 * AppConfigManager - Singleton class to manage application configuration
 * Implements the Singleton design pattern to ensure only one configuration instance exists
 */
class AppConfigManager {
  private static instance: AppConfigManager | null = null
  private config: Record<string, any> = {}

  // Private constructor to prevent direct construction calls with 'new'
  private constructor() {
    // Initialize with default configuration
    this.config = {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
      appName: 'Personal Expenses Management',
      defaultCurrency: 'USD',
      defaultTheme: 'dark',
      dateFormat: 'DD/MM/YYYY',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'VND', 'JPY'],
      version: '1.0.0',
    }
  }

  // Static method to access the singleton instance
  public static getInstance(): AppConfigManager {
    if (!AppConfigManager.instance) {
      AppConfigManager.instance = new AppConfigManager()
    }
    return AppConfigManager.instance
  }

  // Get a configuration value
  public get(key: string): any {
    return this.config[key]
  }

  // Set a configuration value
  public set(key: string, value: any): void {
    this.config[key] = value
  }

  // Get all configuration
  public getAll(): Record<string, any> {
    return { ...this.config }
  }

  // Reset configuration to default
  public reset(): void {
    this.constructor()
  }

  // Update multiple configuration values at once
  public update(newConfig: Record<string, any>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    }
  }
}

// Export the AppConfigManager singleton
export default AppConfigManager
