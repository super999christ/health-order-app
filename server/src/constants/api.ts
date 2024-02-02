import axios from 'axios';

import Environment from './base';

const agilityApiClient = axios.create({
  baseURL: Environment.AGILITY_BASE_URL
});

export { agilityApiClient };
