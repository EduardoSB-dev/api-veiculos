import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './vehicle.entity';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicles: VehiclesService) {}
  @Get()
  @ApiOkResponse({ type: [Vehicle] })
  findAll() { return this.vehicles.findAll(); }
  @Get(':id')
  @ApiOkResponse({ type: Vehicle })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.vehicles.findOne(id); }
  @Post()
  @ApiCreatedResponse({ type: Vehicle })
  create(@Body() dto: CreateVehicleDto) { return this.vehicles.create(dto); }
  @Patch(':id')
  @ApiOkResponse({ type: Vehicle })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVehicleDto) { return this.vehicles.update(id, dto); }
  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  remove(@Param('id', ParseIntPipe) id: number) { return this.vehicles.remove(id); }
}
