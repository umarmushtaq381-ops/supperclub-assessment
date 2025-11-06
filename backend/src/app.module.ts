// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OffersModule } from './offers/offers.module'; // <-- MUST BE HERE

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OffersModule, // <-- MUST BE HERE
  ],
})
export class AppModule {}