import { Injectable, NotFoundException } from '@nestjs/common';
import { Alumno } from './alumno.entity';

@Injectable()
export class AlumnosService {
  async create(
    nombre: string,
    apellido: string,
    curso: number,
    edad: number,
  ): Promise<Alumno> {
    const alumno = new Alumno(nombre, apellido, curso, edad);
    await Alumno.save(alumno);
    return alumno;
  }

  async findAll(): Promise<Alumno[]> {
    return Alumno.findAll();
  }

  async findById(id: string): Promise<Alumno> {
    const alumno = await Alumno.findById(id);
    if (!alumno) {
      throw new NotFoundException('Alumno no encontrado');
    }
    return alumno;
  }

  async update(
    id: string,
    nombre: string,
    apellido: string,
    curso: number,
    edad: number,
  ): Promise<Alumno> {
    const alumno = await this.findById(id);
    await Alumno.update(alumno.id, nombre, apellido, curso, edad);
    let alm = new Alumno(nombre, apellido, curso, edad);
    alm.id = alumno.id;
    return alm;
  }

  async delete(id: string): Promise<any> {
    await this.findById(id);
    await Alumno.delete(id);
    return { msg: `Almuno Eliminado con exito con id:${id}` };
  }
}
