/**
 * ApiClient - Singleton class to manage API requests
 * Implements the Singleton design pattern to ensure only one API client instance exists
 */
class ApiClient {
  private static instance: ApiClient | null = null
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  // Private constructor to prevent direct construction calls with 'new'
  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  // Static method to access the singleton instance
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  // Set default headers
  public setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers,
    }
  }

  // Get method
  public async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'An error occurred')
    }

    return await response.json()
  }

  // Post method
  public async post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'An error occurred')
    }

    return await response.json()
  }

  // Put method
  public async put<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'An error occurred')
    }

    return await response.json()
  }

  // Delete method
  public async delete<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...(data && { body: JSON.stringify(data) }),
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'An error occurred')
    }

    return await response.json()
  }
}

// Export the ApiClient singleton
export default ApiClient
