import { Injectable } from '@nestjs/common';
import { MongoDBService } from './mongodb.service';

@Injectable()
export class UserService {
  constructor(private mongoDBService: MongoDBService) {}

  async authenticateUser(username: string): Promise<any> {
    try {
      console.log(`🔍 Authenticating user: ${username}`);

      const userModel = this.mongoDBService.getUserModel();
      console.log('✅ User model retrieved from MongoDB service');

      // Check if user exists in MongoDB users collection using 'name' field
      const user = await userModel.findOne({ name: username }).exec();
      console.log(
        `🔍 MongoDB query result for name "${username}":`,
        user ? 'User found' : 'User not found'
      );

      if (user) {
        console.log(`✅ User authenticated successfully: ${username}`);
        // Return user data without password
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      }

      console.log(`❌ User not found in database: ${username}`);
      return null;
    } catch (error) {
      console.error('❌ Error authenticating user:', error);
      throw error;
    }
  }

  async createUser(userData: { name: string }): Promise<any> {
    try {
      const userModel = this.mongoDBService.getUserModel();
      const newUser = new userModel(userData);
      const savedUser = await newUser.save();

      // Return user data without password
      const { password, ...userWithoutPassword } = savedUser.toObject();
      return userWithoutPassword;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  async getUserByName(name: string): Promise<any> {
    try {
      const userModel = this.mongoDBService.getUserModel();
      const user = await userModel.findOne({ name }).exec();

      if (user) {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      console.log('🔍 Fetching all users from database...');
      const userModel = this.mongoDBService.getUserModel();
      const users = await userModel.find({}).exec();

      console.log(`✅ Found ${users.length} users in database`);
      return users;
    } catch (error) {
      console.error('❌ Error fetching all users:', error);
      throw error;
    }
  }
}
