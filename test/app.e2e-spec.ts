import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AlumnosService } from './../src/alumnos/alumnos.service';
import { NotFoundException } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const originalKey = process.env.API_KEY;

  beforeAll(() => {
    process.env.API_KEY = 'test-only-key';
  });

  afterAll(() => {
    if (originalKey === undefined) delete process.env.API_KEY;
    else process.env.API_KEY = originalKey;
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AlumnosService)
      .useValue({
        findAll: jest.fn().mockResolvedValue([]),
        findById: jest.fn().mockRejectedValue(new NotFoundException()),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('api-key', 'test-only-key')
      .expect(200)
      .expect('Hello World!');
  });

  it('rechaza una petición sin API key', () => {
    return request(app.getHttpServer()).get('/alumnos').expect(401);
  });

  it('obtiene alumnos sin acceder a AWS', () => {
    return request(app.getHttpServer())
      .get('/alumnos')
      .set('api-key', 'test-only-key')
      .expect(200)
      .expect([]);
  });

  it('devuelve 404 si el alumno no existe', () => {
    return request(app.getHttpServer())
      .get('/alumnos/inexistente')
      .set('api-key', 'test-only-key')
      .expect(404);
  });
});
