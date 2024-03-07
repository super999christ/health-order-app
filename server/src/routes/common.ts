import type { AxiosResponse } from 'axios';
import { Router } from 'express';

import { agilityApiClient } from '../constants/api';
import { globalStore } from '../services/azure';
import { generateAccessToken } from '../utils/jwt';

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

commonRouter.get('/orders', async (req, res) => {
  const patientID = req.query.patientID as string;
  const orders = globalStore.orders.filter(
    order => order.PatientID === patientID
  );
  res.status(200).send(orders);
});

export { commonRouter };
