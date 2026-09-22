import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { Alumno } from './alumno.entity';
import { ApiKeyGuard } from '../guard';

@Controller('alumnos')
@UseGuards(ApiKeyGuard)
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() body: Alumno): Promise<Alumno> {
    return this.alumnosService.create(
      body.nombre,
      body.apellido,
      body.curso,
      body.edad,
    );
  }

  @Get()
  async findAll(): Promise<Alumno[]> {
    return this.alumnosService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Alumno> {
    return this.alumnosService.findById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() body: Alumno): Promise<Alumno> {
    return this.alumnosService.update(
      id,
      body.nombre,
      body.apellido,
      body.curso,
      body.edad,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.alumnosService.delete(id);
  }
}
