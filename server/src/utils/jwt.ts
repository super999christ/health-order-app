import jwt from 'jsonwebtoken';

import Environment from '../constants/base';

export const generateAccessToken = payload => {
  return jwt.sign(payload, Environment.TOKEN_SECRET, { expiresIn: '3600s' });
};

export const generateRefreshToken = payload => {
  return jwt.sign(payload, Environment.TOKEN_SECRET, { expiresIn: '86400s' });
};

export const verifyRefreshToken = refreshToken => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, Environment.TOKEN_SECRET, (error, user) => {
      if (error) {
        reject(new Error('Invalid refresh token'));
      } else {
        const newToken = generateAccessToken({ userId: user.userId });
        resolve(newToken);
      }
    });
  });
};
