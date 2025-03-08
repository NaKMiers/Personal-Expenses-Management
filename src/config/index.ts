// Import the Singleton managers and functions
import DatabaseManager, { connectDatabase } from './database'

// Import the Singleton managers
import AppConfigManager from './appConfig'
import ThemeManager from './themeManager'
import ApiClient from './apiClient'

export { DatabaseManager, connectDatabase, AppConfigManager, ThemeManager, ApiClient }

// Example of how to use the Singleton managers:
/*
import { 
  DatabaseManager, 
  connectDatabase, 
  AppConfigManager, 
  ThemeManager, 
  ApiClient 
} from '@/config'

// Method 1: Using the legacy function
connectDatabase()

// Method 2: Using the Singleton instance
const dbManager = DatabaseManager.getInstance()
dbManager.connect()

// Get other singleton instances
const configManager = AppConfigManager.getInstance()
const themeManager = ThemeManager.getInstance()
const apiClient = ApiClient.getInstance()

// Use the instances
const appName = configManager.get('appName')
themeManager.setTheme('dark')
apiClient.get('/api/transactions')
*/
