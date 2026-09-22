# API Alumnos

API REST desarrollada con NestJS y TypeScript para gestionar alumnos mediante un CRUD. Utiliza Amazon DynamoDB como persistencia y está preparada para ejecutarse como servidor local o como función AWS Lambda.

## Características principales

- Crear, consultar, actualizar y eliminar alumnos.
- Validar nombre, apellido, curso y edad en las solicitudes de creación y actualización.
- Proteger los endpoints mediante una API Key.
- Persistir los datos en Amazon DynamoDB.
- Ejecutar la aplicación como servidor NestJS local o mediante AWS Lambda y Serverless Framework.
- Explorar la documentación Swagger/OpenAPI.
- Responder con errores HTTP apropiados, incluido 404 cuando un alumno no existe.

## Tecnologías

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

### AWS / Cloud

![AWS Lambda](https://img.shields.io/badge/AWS%20Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white)
![Amazon DynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)
![Serverless Framework](https://img.shields.io/badge/Serverless%20Framework-FD5750?style=for-the-badge&logo=serverless&logoColor=white)

### API

![Swagger / OpenAPI](https://img.shields.io/badge/Swagger%20%2F%20OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

### Calidad

![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-333333?style=for-the-badge&logo=nodedotjs&logoColor=white)

## Arquitectura y organización

```text
src/
├── alumnos/
│   ├── alumno.entity.ts
│   ├── alumnos.controller.ts
│   ├── alumnos.module.ts
│   └── alumnos.service.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── guard.ts
└── main.ts
```

El controlador de alumnos define las rutas HTTP; el servicio coordina las operaciones y el modelo `Alumno` accede a DynamoDB. `guard.ts` valida la API Key. `app.module.ts` reúne los módulos de la aplicación y `main.ts` configura Swagger y el arranque local, además de exportar el handler para Lambda.

## API

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `POST` | `/alumnos` | Crear un alumno |
| `GET` | `/alumnos` | Obtener todos los alumnos |
| `GET` | `/alumnos/:id` | Obtener un alumno por ID |
| `PUT` | `/alumnos/:id` | Actualizar un alumno |
| `DELETE` | `/alumnos/:id` | Eliminar un alumno |

La aplicación también define `GET /` como ruta de ejemplo local.

## Seguridad

Los controladores de la API usan la cabecera `api-key`. Su valor se compara con la variable de entorno `API_KEY`; las solicitudes sin una clave válida reciben HTTP 401.

En creación y actualización, NestJS valida que `nombre` y `apellido` sean textos no vacíos de 1 a 50 caracteres, que `curso` sea un entero entre 1 y 12 y que `edad` sea un entero entre 5 y 100. La consulta de un alumno inexistente devuelve HTTP 404.

## Swagger / OpenAPI

Con el servidor local en ejecución, la documentación interactiva está disponible en `http://localhost:3000/api`. Permite explorar las rutas y los modelos documentados por la aplicación.

## Variables de entorno

El archivo `.env.example` contiene las variables de ejemplo:

| Variable | Uso |
| --- | --- |
| `API_KEY` | Clave requerida por el guard de los endpoints |
| `AWS_REGION` | Región utilizada por el cliente DynamoDB; el ejemplo usa `sa-east-1` |
| `DYNAMODB_TABLE` | Nombre de la tabla; el ejemplo usa `Alumnos` |
| `DYNAMODB_ENDPOINT` | Endpoint opcional para DynamoDB local; el ejemplo apunta al puerto `8000` |
| `CORS_ORIGIN` | Origen permitido para solicitudes CORS cuando se configura |

## Instalación

```bash
git clone https://github.com/fernandocastrodev/api-nest-alumnos.git
cd api-nest-alumnos
npm ci
cp .env.example .env
```

Ajusta las variables de `.env` para tu entorno. Mantén ese archivo fuera de Git.

## Ejecución local

Con DynamoDB disponible y las variables configuradas, inicia el servidor NestJS en modo de desarrollo:

```bash
npm run start:dev
```

El servidor escucha en el puerto `3000` de forma predeterminada. Para compilar y ejecutar el resultado:

```bash
npm run build
npm run start:prod
```

## AWS Lambda / Serverless

`serverless.yml` configura funciones AWS Lambda para las rutas CRUD y una tabla DynamoDB. El handler se exporta desde `src/main.ts` y el despliegue utiliza el archivo compilado `dist/main.js`. La región configurada es `sa-east-1` y el nombre de tabla puede definirse mediante `DYNAMODB_TABLE`.

El repositorio contiene la configuración de despliegue; no se afirma que exista un despliegue activo.

## Pruebas

```bash
npm test
npm run test:e2e
```

En la última validación local aprobaron **8 pruebas unitarias** y **4 pruebas e2e**: **12 pruebas en total**. Las pruebas e2e utilizan un servicio de alumnos simulado y no requieren conexión real con AWS.

## Autor

**Fernando Castro**\
Senior Software Developer | Backend & Full Stack\
Node.js · NestJS · TypeScript · .NET · AWS

GitHub: [fernandocastrodev](https://github.com/fernandocastrodev)
