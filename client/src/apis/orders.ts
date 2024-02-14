import { apiClient } from "../constants/api";
import Environment from "../constants/base";

export const submitOrder = async (order: unknown) => {
  try {
    const response = await apiClient.post(Environment.API.SUBMIT_ORDER, order);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};