import express from 'express';

import { agilityRouter } from './routes/agility';
import { commonRouter } from './routes/common';

const app = express();
const port = 3000;

app.use('/api/agility', agilityRouter);
app.use('/api/common', commonRouter);

app.listen(port, () => {
  return console.log(`Server is listening at port ${port}`);
});
