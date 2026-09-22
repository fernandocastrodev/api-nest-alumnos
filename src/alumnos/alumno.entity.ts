import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
let dynamoDb: DynamoDB.DocumentClient;

function getDynamoDb(): DynamoDB.DocumentClient {
  return (dynamoDb ??= new DynamoDB.DocumentClient({
    region: process.env.AWS_REGION || 'sa-east-1',
    ...(process.env.DYNAMODB_ENDPOINT && {
      endpoint: process.env.DYNAMODB_ENDPOINT,
    }),
  }));
}

function tableName(): string {
  return process.env.DYNAMODB_TABLE || 'Alumnos';
}

export class Alumno {
  id: string;
  @ApiProperty()
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  apellido: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  curso: number;

  @ApiProperty()
  @IsInt()
  @Min(5)
  @Max(100)
  @IsNotEmpty()
  edad: number;

  constructor(nombre: string, apellido: string, curso: number, edad: number) {
    this.id = uuidv4();
    this.nombre = nombre;
    this.apellido = apellido;
    this.curso = curso;
    this.edad = edad;
  }

  static async save(alumno: Alumno): Promise<void> {
    const params = {
      TableName: tableName(),
      Item: alumno,
    };
    await getDynamoDb().put(params).promise();
  }

  static async findAll(): Promise<Alumno[]> {
    const params = {
      TableName: tableName(),
    };
    const result = await getDynamoDb().scan(params).promise();
    return result.Items as Alumno[];
  }

  static async findById(id: string): Promise<Alumno | null> {
    const params = {
      TableName: tableName(),
      Key: { id },
    };
    const result = await getDynamoDb().get(params).promise();
    return result.Item ? (result.Item as Alumno) : null;
  }

  static async update(
    id: string,
    nombre: string,
    apellido: string,
    curso: number,
    edad: number,
  ): Promise<void> {
    const params = {
      TableName: tableName(),
      Key: { id },
      UpdateExpression:
        'set nombre = :nombre, apellido = :apellido, curso = :curso, edad = :edad',
      ExpressionAttributeValues: {
        ':nombre': nombre,
        ':apellido': apellido,
        ':curso': curso,
        ':edad': edad,
      },
    };
    await getDynamoDb().update(params).promise();
  }

  static async delete(id: string): Promise<void> {
    const params = {
      TableName: tableName(),
      Key: { id },
    };
    await getDynamoDb().delete(params).promise();
  }
}
