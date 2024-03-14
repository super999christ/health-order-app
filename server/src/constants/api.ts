import axios from 'axios';

import Environment from './base';

const agilityApiClient = axios.create({
  baseURL: Environment.AGILITY_BASE_URL,
  headers: {
    'Ocp-Apim-Subscription-Key': Environment.OCP_APIM_SUBSCRIPTION_KEY,
    'Ocp-Apim-Trace': true,
    AccountID: Environment.ACCOUNT_ID
  },
  auth: {
    username: Environment.ORDER_APP_USERNAME,
    password: Environment.ORDER_APP_PASSWORD
  }
});

export { agilityApiClient };
