import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import Environment from '../constants/base';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, Environment.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error(err);
      res.sendStatus(403);
      return;
    }
    req.user = user as any;
    next();
  });
};
