class AppConfig {
  private static instance: AppConfig;
  private config: Record<string, string> = {};

  private constructor() {
    this.config = {
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      mongodbUri: process.env.MONGODB || '',
      clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
      clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
      maxDateRange: process.env.NEXT_PUBLIC_MAX_DATE_RANGE || '90',
    };

    if (!this.config.mongodbUri) {
      throw new Error('MONGODB environment variable is required');
    }
    if (!this.config.clerkSecretKey) {
      throw new Error('CLERK_SECRET_KEY environment variable is required');
    }
  }

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  public getConfig(key: string): string {
    if (!this.config[key]) {
      throw new Error(`Configuration key "${key}" not found`);
    }
    return this.config[key];
  }
}

const appConfig = AppConfig.getInstance();
export default appConfig;