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