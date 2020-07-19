import express from 'express'

import athleteRouter from './routes/athlete'
import teamRouter from './routes/team'

const app = express();

app.use('/athlete', athleteRouter);
app.use('/teams', teamRouter);

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;