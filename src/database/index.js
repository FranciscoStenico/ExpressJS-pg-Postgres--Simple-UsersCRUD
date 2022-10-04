import { Client } from 'pg';
import 'dotenv/config';

const database = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.SECRET_KEY,
  port: process.env.DB_PORT,
});

export const startDB = async () => {
  await database.connect();
};

export default database;
