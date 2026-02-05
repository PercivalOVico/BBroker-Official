import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// ============================================================================
// API CLIENT CONFIGURATION
// ============================================================================

class ApiClient {
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: this.getBaseURL(),
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Include cookies for session-based auth
    });

    // Request interceptor - attach auth token and userId
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // If we have an auth token, add it to headers
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        
        // Get userId from localStorage and add to headers
        const userId = localStorage.getItem('userId');
        if (userId) {
          config.headers['X-User-Id'] = userId;
          
          // Also add as query parameter for GET requests
          if (config.method === 'get') {
            config.params = {
              ...config.params,
              userId,
            };
          }
        }
        
        // Log request in development
        if (import.meta.env.DEV) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors globally
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Log successful response in development
        if (import.meta.env.DEV) {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Handle errors
        return this.handleError(error);
      }
    );
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Get base URL based on environment
   */
  private getBaseURL(): string {
    // In development, API is on same origin
    if (import.meta.env.DEV) {
      return '';
    }
    
    // In production, could be different domain
    return import.meta.env.VITE_API_URL || '';
  }

  /**
   * Handle API errors globally
   */
  private async handleError(error: AxiosError): Promise<never> {
    const status = error.response?.status;
    const message = this.getErrorMessage(error);

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error [${status}]:`, message);
    }

    // Handle specific status codes
    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        this.handleUnauthorized();
        break;
        
      case 403:
        // Forbidden - show error toast
        this.showToast('Access denied. You do not have permission.', 'error');
        break;
        
      case 404:
        // Not found - could show error page or toast
        this.showToast('Resource not found.', 'error');
        break;
        
      case 422:
        // Validation error - let component handle
        break;
        
      case 429:
        // Rate limited
        this.showToast('Too many requests. Please slow down.', 'error');
        break;
        
      case 500:
      case 502:
      case 503:
        // Server error
        this.showToast('Server error. Please try again later.', 'error');
        break;
        
      default:
        // Generic error
        if (error.code === 'ECONNABORTED') {
          this.showToast('Request timeout. Please check your connection.', 'error');
        } else if (!status) {
          this.showToast('Network error. Please check your connection.', 'error');
        }
    }

    return Promise.reject(error);
  }

  /**
   * Extract error message from error object
   */
  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data) {
      const data = error.response.data as any;
      if (typeof data === 'string') return data;
      if (data.message) return data.message;
      if (data.error) return data.error;
    }
    return error.message || 'An unknown error occurred';
  }

  /**
   * Handle unauthorized access (401)
   */
  private handleUnauthorized(): void {
    // Clear auth token
    this.clearAuthToken();
    
    // Redirect to login (only if not already on login page)
    if (!window.location.pathname.includes('/login')) {
      this.showToast('Session expired. Please login again.', 'error');
      // Save current path for redirect after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
    }
  }

  /**
   * Show toast notification
   * This uses the toast system from your UI components
   */
  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Dispatch custom event that toast component can listen to
    const event = new CustomEvent('show-toast', {
      detail: { message, type }
    });
    window.dispatchEvent(event);
  }

  // ============================================================================
  // AUTH TOKEN MANAGEMENT
  // ============================================================================

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    // Optionally save to localStorage for persistence
    localStorage.setItem('authToken', token);
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | null {
    // Try to get from memory first
    if (this.authToken) {
      return this.authToken;
    }
    
    // Try to get from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      this.authToken = token;
      return token;
    }
    
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // ============================================================================
  // HTTP METHODS
  // ============================================================================

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  // ============================================================================
  // CONVENIENCE METHODS
  // ============================================================================

  /**
   * Upload file(s)
   */
  async upload<T = any>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  /**
   * Download file
   */
  async download(url: string, filename: string): Promise<void> {
    const response = await this.axiosInstance.get(url, {
      responseType: 'blob',
    });
    
    // Create blob link to download
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const apiClient = new ApiClient();

// Export types for use in other files
export type { AxiosError, AxiosResponse };
