import { apiClient } from "@root/constants/api";
import Environment from "@root/constants/base";

export const getProcedures = async () => {
  const response = await apiClient.get(Environment.API.GET_PROCEDURES);
  return response.data;
};