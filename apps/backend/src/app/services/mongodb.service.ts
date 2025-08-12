import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Injectable()
export class MongoDBService {
  private isConnected = false;
  private portfolioModel: mongoose.Model<any>;

  constructor(private configService: ConfigService) {
    this.initializeMongoDB();
  }

  private async initializeMongoDB() {
    try {
      const mongoUri = this.configService.get<string>('MONGODB_URI');
      const dbName = this.configService.get<string>('MONGODB_DB_NAME');

      if (mongoUri) {
        await mongoose.connect(mongoUri, {
          dbName: dbName || 'stock-management',
        });
        this.isConnected = true;
        console.log('✅ MongoDB connected successfully');
      }
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      this.isConnected = false;
    }
  }

  // Getter methods for other services to use
  getPortfolioModel(): mongoose.Model<any> {
    return this.portfolioModel;
  }

  isMongoDBConnected(): boolean {
    return this.isConnected;
  }
}
