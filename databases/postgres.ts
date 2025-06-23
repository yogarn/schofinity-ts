import postgres from 'postgres';
import config from '../configs';
import logger from '../libraries/logger/winston';

const dbHost = config.get('db.host');
const dbPort = config.get('db.port');
const dbUsername = config.get('db.user');
const dbPassword = config.get('db.password');
const dbName = config.get('db.database');

const sql = postgres({
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbName,
  transform: postgres.camel,
});

export const connectToDatabase = async (): Promise<void> => {
  try {
    await sql`SELECT 1`;
    logger.info('Database connection successful');
  } catch (err) {
    logger.error('Error connecting to the database:', err);
    process.exit(1);
  }
};

export default sql;
