import type { AxiosResponse } from 'axios';
import { Router } from 'express';

import { agilityApiClient } from '../constants/api';
import { generateAccessToken } from '../utils/jwt';

const commonRouter = Router();

commonRouter.post('/userAuthentication', async (req, res) => {
  let result: AxiosResponse;
  try {
    // result = await agilityApiClient.post('/api/userAuthentication', req.body);
    result = await agilityApiClient.post(
      'https://ail-apigateway-dev.agilitihealth.com/scheduler/api/userAuthentication',
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

export { commonRouter };
