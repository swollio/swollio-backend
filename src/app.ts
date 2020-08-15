import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import usersRouter from './routes/users'
import athleteRouter from './routes/athlete'
import teamRouter from './routes/team'
import exerciseRouter from './routes/exercise'
import adminRouter from './routes/admin'
import authRouter from './routes/auth'

const app = express();
app.use(cors({origin: '*'}))
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', usersRouter);
app.use('/athletes', athleteRouter);
app.use('/teams', teamRouter);
app.use('/exercises', exerciseRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/ping', (req, res) => {
  res.send('pong');
})

export default app;