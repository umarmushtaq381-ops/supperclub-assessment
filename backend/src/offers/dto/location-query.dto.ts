// src/offers/dto/location-query.dto.ts
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class LocationQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lat?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lng?: number;
}