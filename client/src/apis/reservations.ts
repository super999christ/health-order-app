import { apiClient } from "@root/constants/api";
import Environment from "@root/constants/base";

export const createReservation = async (reservationData: unknown) => {
  try {
    const res = await apiClient.post(Environment.API.CREATE_RESERVATION, reservationData);
    return res.data;
  } catch (err) {
    console.log("Error while creating a reservation: ", err);
  }
};

export const getReservations = async () => {
  try {
    const res = await apiClient.get(Environment.API.GET_RESERVATIONS);
    return res.data;
  } catch (err) {
    console.log("Error while getting reservations: ", err);
  }
};