import express from 'express'

import athleteRouter from './routes/athlete'
import teamRouter from './routes/team'
import exerciseRouter from './routes/exercise'
import db from './database'

const app = express();

db['users.all']().then(res => console.log(res.rows));

app.use('/athletes', athleteRouter);
app.use('/teams', teamRouter);
app.use('/exercises', exerciseRouter);

app.get('/ping', (req, res) => {
  res.send('pong');
})

export default app;