import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
const dynamoDb = new DynamoDB.DocumentClient({ region: 'sa-east-1' });

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
      TableName: 'Alumnos',
      Item: alumno,
    };
    await dynamoDb.put(params).promise();
  }

  static async findAll(): Promise<Alumno[]> {
    const params = {
      TableName: 'Alumnos',
    };
    const result = await dynamoDb.scan(params).promise();
    return result.Items as Alumno[];
  }

  static async findById(id: string): Promise<Alumno | null> {
    const params = {
      TableName: 'Alumnos',
      Key: { id },
    };
    const result = await dynamoDb.get(params).promise();
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
      TableName: 'Alumnos',
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
    await dynamoDb.update(params).promise();
  }

  static async delete(id: string): Promise<void> {
    const params = {
      TableName: 'Alumnos',
      Key: { id },
    };
    await dynamoDb.delete(params).promise();
  }
}
