import { apiClient } from "@root/constants/api";
import Environment from "@root/constants/base";
import { IUserAccess } from "@root/types/fhir.type";
import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) {
      return false;
    }
    const expirationTimeInSeconds = decoded.exp;
    const currentDateInSeconds = new Date().getTime() / 1000;
    return currentDateInSeconds <= expirationTimeInSeconds;
  } catch (err) {
    console.log("Token validation error: ", err);
    return false;
  }
};

export const logout = () => {
  localStorage.clear();
  window.location.reload();
};

export const refreshTokenRotate = async (refreshToken: string) => {
  try {
    const res = await apiClient.post(Environment.API.ROTATE_TOKEN, { refreshToken });
    return res.data;
  } catch (err) {
    console.log("Error while refreshing token: ", err);
  }
};

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const getUsername = (token: string) => {
  const jwt = parseJwt(token);
  return jwt ? jwt.userId : "";
};

export const hasUserAccessPage = (userAccess: IUserAccess) => {
  const pageUrl = location.href;
  if (userAccess === 'none')
    return false;
  if (userAccess === 'full')
    return true;
  const whitelist: Record<IUserAccess, string[]> = {
    none: [],
    full: [],
    order: [
      '/order/submit',
      '/order/list',
      '/order/view',
      '/order/confirm',
    ],
    scheduler: [
      '/reservation/calendar',
      '/reservation/detail',
      '/reservation/submit'
    ]
  };
  return whitelist[userAccess].some(url => pageUrl.includes(url));
}