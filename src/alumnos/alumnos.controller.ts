import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
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
  async create(
    @Body() body: Alumno,
    // body: {
    //   nombre: string;
    //   apellido: string;
    //   curso: number;
    //   edad: number;
    // },
  ): Promise<Alumno> {
    try {
      return await this.alumnosService.create(
        body.nombre,
        body.apellido,
        body.curso,
        body.edad,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Hubo un error al crear el alumno',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<Alumno[]> {
    try {
      return await this.alumnosService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Hubo un error al obtener los alumnos',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Alumno> {
    try {
      return await this.alumnosService.findById(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Hubo un error al obtener el alumno con id ${id}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() body: Alumno,
    // body: { nombre: string; apellido: string; curso: number; edad: number },
  ): Promise<Alumno> {
    try {
      return await this.alumnosService.update(
        id,
        body.nombre,
        body.apellido,
        body.curso,
        body.edad,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Hubo un error al actualizar el alumno con id ${id}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    try {
      return await this.alumnosService.delete(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Hubo un error al eliminar el alumno con id ${id}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
