import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5435),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [`${import.meta.dirname}/../entities/*.entities.{ts,js}`],
  migrations: [`${import.meta.dirname}/migrations/*.{ts,js}`],
  synchronize: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);
