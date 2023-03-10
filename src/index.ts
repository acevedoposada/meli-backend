import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import * as routes from './routes';
import docs from './views/docs';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/items', routes.items);

app.get('/', (_: Request, res: Response) => {
  res.send(docs);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running in port ${port}`);
});
