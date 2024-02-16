import jwt from 'jsonwebtoken';

import Environment from '../constants/base';

export const generateAccessToken = payload => {
  return jwt.sign(payload, Environment.TOKEN_SECRET, { expiresIn: '3600s' });
};

export const generateRefreshToken = payload => {
  return jwt.sign(payload, Environment.TOKEN_SECRET, { expiresIn: '86400s' });
};
