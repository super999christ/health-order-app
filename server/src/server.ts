import cors from 'cors';
import express from 'express';

import { startCRONService } from './crons';
import { authenticateToken } from './middlewares/authenticate';
import { agilityRouter } from './routes/agility';
import { commonRouter } from './routes/common';
import { startEventHubService } from './services/azure';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use('/api/agility', authenticateToken, agilityRouter);
app.use('/api/common', commonRouter);

startEventHubService();
startCRONService();

app.listen(port, () => {
  return console.log(`Server is listening at port ${port}`);
});
