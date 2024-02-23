import { IProductCatatogItem } from "@root/types/product.type";
import { apiClient } from "../constants/api";
import Environment from "../constants/base";

export const getProductCatalog = async (facilityCode: string): Promise<IProductCatatogItem[]> => {
  try {
    const response = await apiClient.get(Environment.API.CATALOG_INFO, {
      params: {
        facilityCode
      }
    });
    return response.data.result;
  } catch (err) {
    console.error(err);
    return [];
  }
};