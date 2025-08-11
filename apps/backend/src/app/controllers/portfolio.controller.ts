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
    const portfolio = await this.portfolioService.getPortfolio(user);

    if (!portfolio) {
      // Return 404 with proper JSON response
      throw new HttpException(
        {
          error: 'Portfolio not found',
          user: user,
          message: 'No portfolio exists for this user',
        },
        HttpStatus.NOT_FOUND
      );
    }

    return portfolio;
  }

  @Get()
  async getAllPortfolios(): Promise<Portfolio[]> {
    return this.portfolioService.getAllPortfolios();
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
