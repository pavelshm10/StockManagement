import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), //|| 'mongodb+srv://pavelsh00:pavelsh00@test.4bsjii7.mongodb.net/?retryWrites=true&w=majority&appName=Test',
        dbName: configService.get<string>('MONGODB_DB_NAME'), // || 'stocks_management',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
