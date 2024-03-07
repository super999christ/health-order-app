import cors from 'cors';
import express from 'express';

import { authenticateToken } from './middlewares/authenticate';
import { agilityRouter } from './routes/agility';
import { commonRouter } from './routes/common';
import { mockPushOrders } from './services/azure';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

mockPushOrders();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use('/api/agility', authenticateToken, agilityRouter);
app.use('/api/common', commonRouter);

app.listen(port, () => {
  return console.log(`Server is listening at port ${port}`);
});
