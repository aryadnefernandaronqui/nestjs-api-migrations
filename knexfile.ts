import { config as dotenvConfig } from 'dotenv';
import { Knex } from 'knex';

dotenvConfig(); // Carrega as variáveis de ambiente

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_WRITE_HOST, 
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};

export default config;
