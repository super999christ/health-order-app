import type { AxiosResponse } from 'axios';
import { Router } from 'express';

import { agilityApiClient } from '../constants/api';
import { globalStore } from '../services/azure';
import { generateAccessToken, verifyRefreshToken } from '../utils/jwt';

const commonRouter = Router();

commonRouter.post('/login', async (req, res) => {
  let result: AxiosResponse;
  try {
    result = await agilityApiClient.post(
      '/scheduler/api/userAuthentication',
      req.body
    );
    if (result.data.USERVERIFIED) {
      // Generates access_token & refresh_token for future authentication
      const payload = { userId: req.body.USERID };
      result.data.accessToken = generateAccessToken(payload);
      result.data.refreshToken = generateAccessToken(payload);
    } else {
      result.status = 401;
      result.data = 'Invalid username or password';
    }
  } catch (err) {
    console.error(err);
    result = err.response || {
      status: 500,
      data: 'Something went wrong'
    };
  }
  res.status(result.status).send(result.data);
});

commonRouter.get('/GetLatestOrderByPatient', async (req, res) => {
  const { PatientID, EpicIDNumber } = req.query as any;
  const orders = globalStore.orders.filter(
    order =>
      order.PatientID === PatientID && order.EpicIDNumber === EpicIDNumber
  );
  if (orders.length > 0) {
    const lastOrder = orders[orders.length - 1];
    res.status(200).send(lastOrder);
  } else {
    res.status(500).send({ message: 'New order was not found from EventHub' });
  }
});

commonRouter.post('/token-refresh', async (req, res) => {
  try {
    const newToken = await verifyRefreshToken(req.body.refreshToken);
    res.send({ token: newToken });
  } catch (err) {
    res.status(400).send(err);
  }
});

export { commonRouter };
