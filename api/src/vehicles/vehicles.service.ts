import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(@InjectRepository(Vehicle) private readonly vehicles: Repository<Vehicle>) {}
  findAll() { return this.vehicles.find({ order: { id: 'ASC' } }); }
  async findOne(id: number) {
    const vehicle = await this.vehicles.findOneBy({ id });
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');
    return vehicle;
  }
  create(dto: CreateVehicleDto) { return this.vehicles.save(this.vehicles.create(dto)); }
  async update(id: number, dto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);
    return this.vehicles.save(Object.assign(vehicle, dto));
  }
  async remove(id: number) {
    const result = await this.vehicles.delete(id);
    if (!result.affected) throw new NotFoundException('Veículo não encontrado');
  }
}
