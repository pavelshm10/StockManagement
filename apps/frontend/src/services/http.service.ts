import { config } from '../config/env';

// HTTP Service Configuration
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

// Request interceptor type
type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>;

// Response interceptor type
type ResponseInterceptor<T = any> = (
  response: Response,
  config: RequestConfig
) => T | Promise<T>;

// Request configuration interface
interface RequestConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

// HTTP Service Class
class HttpService {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor<T = any>(interceptor: ResponseInterceptor<T>) {
    this.responseInterceptors.push(interceptor);
  }

  // Build full URL with query parameters
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, BASE_URL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  // Generic request method
  async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      // Apply request interceptors
      let finalConfig = { ...config };
      for (const interceptor of this.requestInterceptors) {
        finalConfig = await interceptor(finalConfig);
      }

      // Build headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...finalConfig.headers,
      };

      // Build request options
      const requestOptions: RequestInit = {
        method: finalConfig.method,
        headers,
      };

      // Add body if present
      if (finalConfig.body) {
        requestOptions.body = JSON.stringify(finalConfig.body);
      }

      // Make the request
      const response = await fetch(
        this.buildUrl(finalConfig.url, finalConfig.params),
        requestOptions
      );

      // Apply response interceptors
      let result = response;
      for (const interceptor of this.responseInterceptors) {
        result = await interceptor(result, finalConfig);
      }

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse JSON response
      if (response.headers.get('content-type')?.includes('application/json')) {
        return await response.json();
      }

      return response.text() as T;
    } catch (error) {
      console.error('HTTP Request failed:', error);
      throw error;
    }
  }

  // Convenience methods
  async get<T = any>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    return this.request<T>({
      url: endpoint,
      method: 'GET',
      params,
    });
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    params?: Record<string, string>
  ): Promise<T> {
    return this.request<T>({
      url: endpoint,
      method: 'POST',
      body,
      params,
    });
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    params?: Record<string, string>
  ): Promise<T> {
    return this.request<T>({
      url: endpoint,
      method: 'PUT',
      body,
      params,
    });
  }

  async delete<T = any>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    return this.request<T>({
      url: endpoint,
      method: 'DELETE',
      params,
    });
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    params?: Record<string, string>
  ): Promise<T> {
    return this.request<T>({
      url: endpoint,
      method: 'PATCH',
      body,
      params,
    });
  }
}

// Create singleton instance
export const httpService = new HttpService();

// Add default interceptors
httpService.addRequestInterceptor((config) => {
  // Log requests in development
  if (import.meta.env.DEV) {
    console.log(`🚀 ${config.method} ${config.url}`, {
      params: config.params,
      body: config.body,
    });
  }
  return config;
});

httpService.addResponseInterceptor((response, config) => {
  // Log responses in development
  if (import.meta.env.DEV) {
    console.log(`✅ ${config.method} ${config.url}`, {
      status: response.status,
      statusText: response.statusText,
    });
  }
  return response;
});

// Export the service
export default httpService;
