import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicles/vehicle.entity';
import { VehiclesController } from './vehicles/vehicles.controller';
import { VehiclesService } from './vehicles/vehicles.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres', host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.getOrThrow<string>('DB_USER'), password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'), entities: [Vehicle],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Vehicle]),
  ],
  controllers: [VehiclesController], providers: [VehiclesService],
})
export class AppModule {}
