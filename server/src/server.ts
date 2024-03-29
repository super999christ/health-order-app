import cors from 'cors';
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { startCRONService } from './crons';
import { agilityRouter } from './routes/agility';
import { commonRouter } from './routes/common';
import { startEventHubService } from './services/azure';
import { authenticateToken } from './middlewares/authenticate';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || (process.env.NODE_ENV === 'production' ? 3000 : 8000);

app.use(cors());
app.use(express.json());

app.use('/api/agility/order', agilityRouter);
app.use('/api/agility/reservationapi', authenticateToken, agilityRouter);
app.use('/api/common', commonRouter);

const baseFilePath = fileURLToPath(import.meta.url);
const baseDirPath = dirname(baseFilePath);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(baseDirPath, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(join(`${baseDirPath}/public/index.html`));
  });
}

startEventHubService();
startCRONService();

app.listen(port, () => {
  return console.log(`Server is listening at port ${port}`);
});
