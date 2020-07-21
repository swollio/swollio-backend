import express from 'express'

import athleteRouter from './routes/athlete'
import teamRouter from './routes/team'
import exerciseRouter from './routes/exercise'
import { pool } from './database'

const _ = pool;

const app = express();
app.use('/athletes', athleteRouter);
app.use('/teams', teamRouter);
app.use('/exercises', exerciseRouter);

app.get('/ping', (req, res) => {
  res.send('pong');
})

export default app;