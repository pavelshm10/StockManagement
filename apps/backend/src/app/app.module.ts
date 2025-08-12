import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioController } from './controllers/portfolio.controller';
import { UserController } from './controllers/user.controller';
import { PortfolioService } from './services/portfolio.service';
import { UserService } from './services/user.service';
import { MongoDBService } from './services/mongodb.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // MongoDB connection handled manually in service to avoid dependency injection issues
  ],
  controllers: [AppController, PortfolioController, UserController],
  providers: [AppService, MongoDBService, PortfolioService, UserService],
})
export class AppModule {}
