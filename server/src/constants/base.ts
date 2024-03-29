import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

dotenv.config({ path: path.join(dirname, '../../.env') });

const Environment = {
  OCP_APIM_SUBSCRIPTION_KEY: process.env.OCP_APIM_SUBSCRIPTION_KEY,
  AGILITY_BASE_URL: process.env.AGILITY_BASE_URL,
  AGILITY_SCHEDULER_BASE_URL: process.env.AGILITY_SCHEDULER_BASE_URL,
  ACCOUNT_ID: process.env.ACCOUNT_ID,
  AZURE_EVENT_HUB_CONNECTION: process.env.AZURE_EVENT_HUB_CONNECTION,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  ORDER_APP_USERNAME: process.env.ORDER_APP_USERNAME,
  ORDER_APP_PASSWORD: process.env.ORDER_APP_PASSWORD,
  API: {
    GET_ORDERS_BY_PATIENT: '/emrorderingapi/api/GetOrdersByPatient',
    GET_ACTIVE_PATIENTS: '/emrorderingapi/api/GetActivePatients',
    DISCHARGE_PATIENT: '/emrorderingapi/api/dischargepatient',
  }
};

export default Environment;
