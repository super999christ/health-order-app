import type { Request, Response } from 'express';
import { Router } from 'express';

import { agilityApiClient } from '../constants/api';

const agilityRouter = Router();

agilityRouter.all('/*', async (req: Request, res: Response) => {
  try {
    const response = await agilityApiClient({
      method: req.method,
      url: req.url,
      data: req.body
    });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export { agilityRouter };
