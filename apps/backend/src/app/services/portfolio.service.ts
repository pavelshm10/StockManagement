import { Injectable } from '@nestjs/common';
import { MongoDBService } from './mongodb.service';
import { Portfolio } from '../schemas/portfolio.schema';

@Injectable()
export class PortfolioService {
  constructor(private mongoDBService: MongoDBService) {}

  async getPortfolio(user: string): Promise<Portfolio | null> {
    try {
      const portfolioModel = this.mongoDBService.getPortfolioModel();
      const portfolio = await portfolioModel.findOne({ user }).exec();
      return portfolio;
    } catch (error) {
      throw error;
    }
  }

  async createPortfolio(portfolio: Portfolio): Promise<Portfolio> {
    try {
      const portfolioModel = this.mongoDBService.getPortfolioModel();
      const newPortfolio = new portfolioModel(portfolio);
      return await newPortfolio.save();
    } catch (error) {
      console.error('❌ Error creating portfolio:', error);
      throw error;
    }
  }

  async updatePortfolio(
    user: string,
    portfolio: Partial<Portfolio>
  ): Promise<Portfolio | null> {
    try {
      const portfolioModel = this.mongoDBService.getPortfolioModel();
      const updated = await portfolioModel
        .findOneAndUpdate({ user }, portfolio, {
          new: true,
          runValidators: true,
        })
        .exec();
      return updated;
    } catch (error) {
      console.error('❌ Error updating portfolio:', error);
      throw error;
    }
  }

  async deletePortfolio(user: string): Promise<boolean> {
    try {
      const portfolioModel = this.mongoDBService.getPortfolioModel();
      const result = await portfolioModel.deleteOne({ user }).exec();
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }
}
