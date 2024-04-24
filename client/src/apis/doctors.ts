import { apiClient } from "@root/constants/api";
import Environment from "@root/constants/base";

export const getDoctors = async () => {
  const response = await apiClient.get(Environment.API.GET_PHYSICIANS);
  return response.data;
};