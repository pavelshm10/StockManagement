import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { Portfolio, PortfolioSchema } from '../schemas/portfolio.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Injectable()
export class MongoDBService {
  private isConnected = false;
  private portfolioModel: mongoose.Model<Portfolio>;
  private userModel: mongoose.Model<User>;

  constructor(private configService: ConfigService) {
    // Initialize models immediately with proper error handling
    this.initializeModels();
    this.initializeMongoDB();
  }

  private initializeModels() {
    try {
      // Create the Portfolio model
      this.portfolioModel = mongoose.model<Portfolio>(
        'Portfolio',
        PortfolioSchema
      );

      // Create the User model
      this.userModel = mongoose.model<User>('User', UserSchema);

      console.log('✅ Portfolio and User models initialized');
    } catch (error) {
      console.error('❌ Error initializing models:', error);
    }
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

        // Initialize with test user if database is empty
        await this.initializeTestUser();
      }
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      this.isConnected = false;
    }
  }

  private async initializeTestUser(): Promise<void> {
    try {
      const existingUser = await this.userModel
        .findOne({ username: 'testuser' })
        .exec();

      if (!existingUser) {
        const testUser = new this.userModel({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          created_at: new Date(),
          updated_at: new Date(),
        });

        await testUser.save();
        console.log('✅ Test user created: testuser');
      } else {
        console.log('✅ Test user already exists: testuser');
      }
    } catch (userError) {
      console.error('❌ Error creating test user:', userError);
    }
  }

  // Getter methods for other services to use
  getPortfolioModel(): mongoose.Model<Portfolio> {
    if (!this.portfolioModel) {
      throw new Error(
        'Portfolio model not initialized. Please check MongoDB connection.'
      );
    }
    return this.portfolioModel;
  }

  getUserModel(): mongoose.Model<User> {
    if (!this.userModel) {
      throw new Error(
        'User model not initialized. Please check MongoDB connection.'
      );
    }
    return this.userModel;
  }

  isMongoDBConnected(): boolean {
    return this.isConnected;
  }
}
