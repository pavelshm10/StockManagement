import { httpService } from './http.service';
import { Portfolio, Stock } from '../types/portfolio.types';

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
  static async searchStocks(query: string, apiKey: string): Promise<any> {
    const searchUrl = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(
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
}

// Export singleton instance
export default ApiService;
