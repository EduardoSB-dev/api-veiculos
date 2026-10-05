import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC1D23', maxLength: 10 })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  plate!: string;

  @ApiProperty({ example: 'Toyota Corolla', maxLength: 120 })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  model!: string;

  @ApiProperty({ example: 2022, minimum: 1886, maximum: 9999 })
  @IsInt()
  @Min(1886)
  @Max(9999)
  year!: number;

  @ApiProperty({ example: 45000, minimum: 0, maximum: 2147483647, description: 'Quilometragem em km inteiros' })
  @IsInt()
  @Min(0)
  @Max(2147483647)
  mileage!: number;
}
