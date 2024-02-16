import { apiClient } from "@root/constants/api";
import Environment from "@root/constants/base";

export const login = async (userName: string, password: string) => {
  return apiClient.post(Environment.API.LOGIN, {
    USERID: userName,
    PASSWORD: password
  });
};