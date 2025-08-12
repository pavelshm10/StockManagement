import { httpService } from './http.service';
import { Portfolio, Stock } from '@stock-management/libs';

// API Service for Backend Communication
export class ApiService {
  // Portfolio endpoints
  static async getPortfolio(user: string): Promise<Portfolio> {
    return httpService.get<Portfolio>(`/portfolio/${user}`);
  }

  static async getAllPortfolios(): Promise<Portfolio[]> {
    return httpService.get<Portfolio[]>('/portfolio');
  }

  static async createPortfolio(portfolio: Portfolio): Promise<Portfolio> {
    return httpService.post<Portfolio>('/portfolio', portfolio);
  }

  static async updatePortfolio(
    user: string,
    portfolio: Partial<Portfolio>
  ): Promise<Portfolio> {
    return httpService.put<Portfolio>(`/portfolio/${user}`, portfolio);
  }

  // Stock search endpoint (external API)
  static async searchStocks(query: string): Promise<any> {
    const apiKey = import.meta.env.VITE_API_KEY;
    const searchUrl = `${
      import.meta.env.VITE_STOCK_API
    }/search?query=${encodeURIComponent(
      query
    )}&limit=10&exchange=NASDAQ&apikey=${apiKey}`;

    try {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Stock search failed:', error);
      throw error;
    }
  }

  // Stock quote endpoint (external API) - get detailed stock information
  static async getStockQuote(symbol: string): Promise<any> {
    const apiKey = import.meta.env.VITE_API_KEY;
    const quoteUrl = `${
      import.meta.env.VITE_STOCK_API
    }/quote/${symbol}?apikey=${apiKey}`;

    try {
      const response = await fetch(quoteUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      // The API returns an array, so we take the first item
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      console.error('Stock quote failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default ApiService;
