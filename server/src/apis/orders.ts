import { agilityApiClient } from '../constants/api';
import Environment from '../constants/base';

export const getActivePatients = (EpicIDNumber: string) => {
  return agilityApiClient.get(Environment.API.GET_ACTIVE_PATIENTS, {
    params: { EpicIDNumber }
  });
};
