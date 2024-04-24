import { apiClient } from "@root/constants/api";
import Environment from "@root/constants/base";
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