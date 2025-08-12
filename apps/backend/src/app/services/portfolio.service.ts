import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Portfolio } from '../schemas/portfolio.schema';

@Injectable()
export class PortfolioService {
  private portfolios: Map<string, Portfolio> = new Map();

  constructor(private configService: ConfigService) {
    // Log MongoDB configuration on service initialization
    console.log('🔧 PortfolioService Config:', {
      mongoUri: this.configService.get<string>('MONGODB_URI')
        ? 'Configured'
        : 'Not configured',
      dbName: this.configService.get<string>('MONGODB_DB_NAME') || 'Not set',
      environment: this.configService.get<string>('NODE_ENV') || 'development',
      usingInMemory: 'Yes (fallback mode)',
    });
  }

  async getPortfolio(user: string): Promise<Portfolio | null> {
    return this.portfolios.get(user) || null;
  }

  async createPortfolio(portfolio: Portfolio): Promise<Portfolio> {
    this.portfolios.set(portfolio.user, portfolio);
    return portfolio;
  }

  async updatePortfolio(
    user: string,
    portfolio: Partial<Portfolio>
  ): Promise<Portfolio | null> {
    const existing = this.portfolios.get(user);
    if (!existing) {
      return null;
    }

    const updated = { ...existing, ...portfolio };
    this.portfolios.set(user, updated);
    return updated;
  }

  async getAllPortfolios(): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values());
  }

  async deletePortfolio(user: string): Promise<boolean> {
    return this.portfolios.delete(user);
  }
}
