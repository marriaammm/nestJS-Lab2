import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    load: [() => ({
      JWT_SECRET: process.env.JWT_SECRET})]
  })
  ,MongooseModule.forRoot('mongodb://localhost/nest')
  ,UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
