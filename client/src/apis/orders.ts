import { apiClient } from '../constants/api';
import Environment from '../constants/base';

export const submitOrder = async (order: unknown) => {
  const response = await apiClient.post(Environment.API.SUBMIT_ORDER, order);
  return response.data;
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

export const getLatestOrder = async (params: {
  PatientID?: string;
  EpicIDNumber?: string;  
}) => {
  const response = await apiClient.get(
    Environment.API.GET_LATEST_ORDER_BY_PATIENT,
    { params }
  );
  return response.data;
};

export const cancelOrder = async (orders: { epicIDNumber: string; orderID: string; }[]) => {
  const response = await apiClient.post(Environment.API.CANCEL_ORDER, orders);
  return response.data;
};

export const dischargePatient = async (patients: { epicIDNumber: string; patientID: string; }[]) => {
  const response = await apiClient.post(Environment.API.DISCHARGE_PATIENT, patients);
  return response.data;
}