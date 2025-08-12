import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginData: { username: string }) {
    try {
      console.log(`🔐 Login attempt for username: ${loginData.username}`);

      if (!loginData.username || !loginData.username.trim()) {
        console.log('❌ Login failed: Empty username');
        throw new HttpException(
          {
            success: false,
            error: 'Invalid input',
            message: 'Username is required',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      const user = await this.userService.authenticateUser(
        loginData.username.trim()
      );

      if (user) {
        console.log(`✅ Login successful for user: ${loginData.username}`);
        return {
          success: true,
          message: 'Login successful',
          user: user,
        };
      } else {
        console.log(
          `❌ Login failed: User not found in database: ${loginData.username}`
        );
        throw new HttpException(
          {
            success: false,
            error: 'Authentication failed',
            message: 'Username does not exist in the database',
          },
          HttpStatus.UNAUTHORIZED
        );
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          error: 'Login failed',
          message: 'An error occurred during login',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('register')
  async register(
    @Body() userData: { name: string; email: string; password: string }
  ) {
    try {
      const user = await this.userService.createUser(userData);
      return {
        success: true,
        message: 'User created successfully',
        user: user,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: 'Registration failed',
          message: 'An error occurred during registration',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':name')
  async getUser(@Param('name') name: string) {
    try {
      const user = await this.userService.getUserByName(name);

      if (user) {
        return {
          success: true,
          user: user,
        };
      } else {
        throw new HttpException(
          {
            success: false,
            error: 'User not found',
            message: 'Name does not exist',
          },
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          error: 'Failed to get user',
          message: 'An error occurred while fetching user data',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Endpoint to check all users in the database
  @Get('check/database')
  async checkDatabase() {
    try {
      console.log('🔍 Checking users collection in database...');
      const users = await this.userService.getAllUsers();

      return {
        success: true,
        message: 'Database check completed',
        totalUsers: users.length,
        users: users.map((user) => ({
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        })),
      };
    } catch (error) {
      console.error('❌ Error checking database:', error);
      throw new HttpException(
        {
          success: false,
          error: 'Database check failed',
          message: 'An error occurred while checking the database',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
