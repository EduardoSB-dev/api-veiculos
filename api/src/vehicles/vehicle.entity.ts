import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('vehicles')
export class Vehicle {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'ABC1D23' })
  @Column({ length: 10 })
  plate!: string;

  @ApiProperty({ example: 'Toyota Corolla' })
  @Column({ length: 120 })
  model!: string;

  @ApiProperty({ example: 2022 })
  @Column({ type: 'int' })
  year!: number;

  @ApiProperty({ example: 45000 })
  @Column({ type: 'int' })
  mileage!: number;
}
