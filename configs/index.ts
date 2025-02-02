import convict from 'convict';
import dotenv from 'dotenv';

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
            env: 'DB_HOST'
        },
        port: {
            doc: 'Database Port',
            format: Number,
            default: 5432,
            env: 'DB_PORT'
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
        }

    }
});

const env = config.get('env');
config.loadFile(`./configs/${env}.json`);
config.validate({ allowed: 'strict' });

export default config;
