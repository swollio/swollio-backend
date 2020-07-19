import express from 'express'

import athleteRouter from './routes/athlete'
import teamRouter from './routes/team'
import exerciseRouter from './routes/exercise'

const app = express();

app.use('/athletes', athleteRouter);
app.use('/teams', teamRouter);
app.use('/exercises', exerciseRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;