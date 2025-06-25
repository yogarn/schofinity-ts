import bodyParser from 'body-parser';
import express from 'express';

import { connectToDatabase } from '@/databases/postgres';
import { globalErrorHandler } from '@/errors/globalErrorHandler';

import logger from '@/libraries/logger/winston';
import router from '@/routers';

const app = express();
const port = 8080;

connectToDatabase();

app.use(bodyParser.json());

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

app.use(globalErrorHandler);

const server = app.listen(port, () => {
  logger.info(`listening on port ${port}`);
});

export const gracefulShutdown = (): void => {
  server.close(() => {
    logger.info('http server closed');
    process.exit(1);
  });
};
