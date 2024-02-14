import { apiClient } from "../constants/api";
import Environment from "../constants/base";

export const getProductCatalog = async (accountId: number) => {
  try {
    const response = await apiClient.get(Environment.API.CATALOG_INFO, {
      params: {
        AccountId: accountId
      }
    });
    return response.data.result;
  } catch (err) {
    console.error(err);
    return null;
  }
};