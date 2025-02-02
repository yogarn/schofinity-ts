import express from 'express';
import bodyParser from 'body-parser';

import userRouter from './apps/users/entry-points/router';
import { globalErrorHandler } from './errors/globalErrorHandler';
import { connectToDatabase } from './databases/postgres';

const app = express();
const port = 8080;

connectToDatabase();

app.use(bodyParser.json());

app.use('/users', userRouter);

app.get("/", (req, res) => {
    res.json({message: "ok"});
});

app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
