import postgres from "postgres";
import config from "../configs";

const dbHost = config.get('db.host');
const dbPort = config.get('db.port');
const dbUsername = config.get('db.username');
const dbPassword = config.get('db.password');
const dbName = config.get(`db.name`);

const sql = postgres({
    host: dbHost,
    port: dbPort,
    username: dbUsername,
    password: dbPassword,
    database: dbName,
    transform: postgres.camel
});

export const connectToDatabase = async () => {
    try {
        await sql`SELECT 1`;
        console.log('Database connection successful');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
};

export default sql;
