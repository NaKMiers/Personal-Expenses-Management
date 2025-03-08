/**
 * Ví dụ về cách sử dụng các Singleton managers trong dự án
 *
 * File này chỉ là ví dụ và không được sử dụng trong dự án thực tế
 */

import DatabaseManager, { connectDatabase } from '../config/database'
import AppConfigManager from '../config/appConfig'
import ThemeManager from '../config/themeManager'
import ApiClient from '../config/apiClient'

/**
 * Ví dụ 1: Sử dụng DatabaseManager
 */
async function databaseExample() {
  console.log('--- Database Manager Example ---')

  // Cách 1: Sử dụng hàm legacy
  const connection1 = await connectDatabase()
  console.log('Connected to database using legacy function')

  // Cách 2: Sử dụng Singleton instance
  const dbManager = DatabaseManager.getInstance()
  const connection2 = await dbManager.connect()
  console.log('Connected to database using Singleton instance')

  // Cả hai connection đều là một instance duy nhất
  console.log('Are connections the same?', connection1 === connection2)

  // Ngắt kết nối
  await dbManager.disconnect()
  console.log('Disconnected from database')
}

/**
 * Ví dụ 2: Sử dụng AppConfigManager
 */
function configExample() {
  console.log('--- Config Manager Example ---')

  // Lấy instance của AppConfigManager
  const configManager = AppConfigManager.getInstance()

  // Lấy giá trị cấu hình
  console.log('App name:', configManager.get('appName'))
  console.log('Default currency:', configManager.get('defaultCurrency'))

  // Thay đổi giá trị cấu hình
  configManager.set('defaultCurrency', 'VND')
  console.log('Updated default currency:', configManager.get('defaultCurrency'))

  // Cập nhật nhiều giá trị cùng lúc
  configManager.update({
    defaultTheme: 'light',
    dateFormat: 'MM/DD/YYYY',
  })

  // Lấy tất cả cấu hình
  console.log('All config:', configManager.getAll())
}

/**
 * Ví dụ 3: Sử dụng ThemeManager
 */
function themeExample() {
  console.log('--- Theme Manager Example ---')

  // Lấy instance của ThemeManager
  const themeManager = ThemeManager.getInstance()

  // Lấy theme hiện tại
  console.log('Current theme:', themeManager.getTheme())

  // Thay đổi theme
  themeManager.setTheme('dark')
  console.log('Updated theme:', themeManager.getTheme())

  // Thêm listener
  const themeListener = (theme: 'light' | 'dark' | 'system') => {
    console.log('Theme changed to:', theme)
  }

  themeManager.addListener(themeListener)

  // Toggle theme
  themeManager.toggleTheme()

  // Xóa listener
  themeManager.removeListener(themeListener)
}

/**
 * Ví dụ 4: Sử dụng ApiClient
 */
async function apiClientExample() {
  console.log('--- API Client Example ---')

  // Lấy instance của ApiClient
  const apiClient = ApiClient.getInstance()

  // Thiết lập headers mặc định
  apiClient.setDefaultHeaders({
    Authorization: 'Bearer token123',
  })

  try {
    // Gọi API GET
    const transactions = await apiClient.get('/api/transactions')
    console.log('Transactions:', transactions)

    // Gọi API POST
    const newTransaction = await apiClient.post('/api/transactions/create', {
      amount: 100,
      description: 'Test transaction',
      date: new Date(),
      type: 'expense',
      category: '123456789',
    })
    console.log('New transaction:', newTransaction)

    // Gọi API PUT
    const updatedTransaction = await apiClient.put('/api/transactions/123/edit', {
      amount: 200,
    })
    console.log('Updated transaction:', updatedTransaction)

    // Gọi API DELETE
    const deleteResult = await apiClient.delete('/api/transactions/delete', {
      ids: ['123'],
    })
    console.log('Delete result:', deleteResult)
  } catch (error) {
    console.error('API error:', error)
  }
}

/**
 * Chạy tất cả các ví dụ
 */
async function runAllExamples() {
  await databaseExample()
  console.log('\n')

  configExample()
  console.log('\n')

  themeExample()
  console.log('\n')

  await apiClientExample()
}

// Chạy tất cả các ví dụ
// runAllExamples().catch(console.error);

export { databaseExample, configExample, themeExample, apiClientExample, runAllExamples }
