import { IsNumber, IsLatitude, IsLongitude } from 'class-validator';

export class RecommendOfferDto {
  @IsNumber()
  userId: number;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;
}