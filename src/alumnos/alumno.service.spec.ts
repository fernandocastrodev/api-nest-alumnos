import { Test, TestingModule } from '@nestjs/testing';
import { AlumnosController } from './alumnos.controller';
import { AlumnosService } from './alumnos.service';
import { Alumno } from './alumno.entity';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
const request = require('supertest');

describe('AlumnosController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/alumnos (GET)', () => {
    return request(app.getHttpServer())
      .get('/alumnos')
      .set('api-key', `${process.env.API_KEY}`)
      .expect(200);
  });
});

describe('AlumnosController', () => {
  let controller: AlumnosController;
  let service: AlumnosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlumnosController],
      providers: [AlumnosService],
    }).compile();

    controller = module.get<AlumnosController>(AlumnosController);
    service = module.get<AlumnosService>(AlumnosService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Crear un alumno', async () => {
      const alumno: Alumno = {
        nombre: 'Guillermo',
        apellido: 'Marcial',
        curso: 4,
        edad: 24,
        id: '',
      };

      jest.spyOn(service, 'create').mockImplementation(async () => alumno);

      expect(await controller.create(alumno)).toBe(alumno);
    });
  });

  describe('findAll', () => {
    it('debe devolver todos los alumnos', async () => {
      const result: Alumno[] = [
        {
          nombre: 'Juan',
          apellido: 'Perez',
          curso: 1,
          edad: 20,
          id: '',
        },
      ];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findById', () => {
    it('debe devolver un alumno por id', async () => {
      const result: Alumno = {
        nombre: 'Juan',
        apellido: 'Perez',
        curso: 1,
        edad: 20,
        id: '',
      };
      jest.spyOn(service, 'findById').mockImplementation(async () => result);

      expect(await controller.findById('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('debe actualizar un alumno by id', async () => {
      const result: Alumno = {
        nombre: 'Juan',
        apellido: 'Perez',
        curso: 1,
        edad: 20,
        id: '',
      };
      jest.spyOn(service, 'update').mockImplementation(async () => result);

      expect(await controller.update('1', result)).toBe(result);
    });
  });

  describe('delete', () => {
    it('deberia eliminar un estudiante por id', async () => {
      const result: any = { message: 'alumno eliminado correctamente' };
      jest.spyOn(service, 'delete').mockImplementation(async () => result);

      expect(await controller.delete('1')).toBe(result);
    });
  });
  // Similar tests can be written for 'findAll', 'findById', 'update', and 'delete'
});
