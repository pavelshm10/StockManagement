import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PortfolioService } from '../services/portfolio.service';
import { Portfolio } from '../schemas/portfolio.schema';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':user')
  async getPortfolio(@Param('user') user: string) {
    try {
      const portfolio = await this.portfolioService.getPortfolio(user);

      return portfolio;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createPortfolio(@Body() portfolio: Portfolio): Promise<Portfolio> {
    return this.portfolioService.createPortfolio(portfolio);
  }

  @Put(':user')
  async updatePortfolio(
    @Param('user') user: string,
    @Body() portfolio: Partial<Portfolio>
  ): Promise<Portfolio | null> {
    return this.portfolioService.updatePortfolio(user, portfolio);
  }
}
