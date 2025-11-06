import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get('recommend/:userId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async recommend(@Param('userId') userId: number, @Query('lat') lat: number, @Query('lng') lng: number) {
    return this.offersService.recommendOffers(userId, { lat, lng });
  }
}