/**
 * ThemeManager - Singleton class to manage application theme
 * Implements the Singleton design pattern to ensure only one theme manager instance exists
 */
class ThemeManager {
  private static instance: ThemeManager | null = null
  private currentTheme: 'light' | 'dark' | 'system'
  private listeners: Array<(theme: 'light' | 'dark' | 'system') => void> = []

  // Private constructor to prevent direct construction calls with 'new'
  private constructor() {
    // Initialize with default theme
    // Try to get theme from localStorage if in browser environment
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system'
      this.currentTheme = savedTheme || 'system'
    } else {
      this.currentTheme = 'system'
    }
  }

  // Static method to access the singleton instance
  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  // Get current theme
  public getTheme(): 'light' | 'dark' | 'system' {
    return this.currentTheme
  }

  // Set theme
  public setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.currentTheme = theme

    // Save to localStorage if in browser environment
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)

      // Apply theme to document
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // Notify listeners
    this.notifyListeners()
  }

  // Toggle between light and dark theme
  public toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    this.setTheme(newTheme)
  }

  // Add listener for theme changes
  public addListener(listener: (theme: 'light' | 'dark' | 'system') => void): void {
    this.listeners.push(listener)
  }

  // Remove listener
  public removeListener(listener: (theme: 'light' | 'dark' | 'system') => void): void {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentTheme))
  }
}

// Export the ThemeManager singleton
export default ThemeManager
