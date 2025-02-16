import convict from 'convict';
import dotenv from 'dotenv';
import { number } from 'zod';

dotenv.config();

const config = convict({
  env: {
    doc: 'The Application Environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'ENVIRONMENT',
  },
  db: {
    host: {
      doc: 'Database Host',
      format: String,
      default: 'localhost',
      env: 'DB_HOST',
    },
    port: {
      doc: 'Database Port',
      format: Number,
      default: 5432,
      env: 'DB_PORT',
    },
    username: {
      doc: 'Database username',
      format: String,
      default: '',
      env: 'DB_USERNAME',
      sensitive: true,
    },
    password: {
      doc: 'Database password',
      format: String,
      default: '',
      env: 'DB_PASSWORD',
      sensitive: true,
    },
    name: {
      doc: 'Database name',
      format: String,
      default: 'schofinity',
      env: 'DB_NAME',
    },
  },
  jwt: {
    expiry: {
      doc: 'Expiry Time',
      format: number,
      default: 3600,
      env: 'JWT_EXPIRY',
    },
  },
  bcrypt: {
    saltRound: {
      doc: 'Salt Round',
      format: number,
      default: 10,
      env: 'BCRYPT_ROUND',
    },
  },
});

const env = config.get('env');
config.loadFile(`./configs/${env}.json`);
config.validate({ allowed: 'strict' });

export default config;
