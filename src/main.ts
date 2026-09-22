import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';

let server: Handler;

async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  if (process.env.CORS_ORIGIN) {
    app.enableCors({ origin: process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()) });
  }
  const config = new DocumentBuilder()
    .setTitle('Api Alumnos')
    .setDescription('Poryecto creado con NestJs, DynamoDB y Serverless')
    .setVersion('1.0')
    .addTag('Alumnos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  return app;
}

async function bootstrap(): Promise<Handler> {
  const app = await createApp();
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

async function startLocal(): Promise<void> {
  const app = await createApp();
  await app.listen(process.env.PORT || 3000);
}

if (require.main === module) {
  void startLocal();
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
