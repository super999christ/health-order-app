import { apiClient } from '../constants/api';
import Environment from '../constants/base';

export const submitOrder = async (order: unknown) => {
  try {
    const response = await apiClient.post(Environment.API.SUBMIT_ORDER, order);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getOrdersByPatient = async (params: {
  PatientID?: string;
  EpicIDNumber?: string;
}) => {
  try {
    const response = await apiClient.get(
      Environment.API.GET_ORDERS_BY_PATIENT,
      { params }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
