import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

dotenv.config({ path: path.join(dirname, '../../.env') });

const Environment = {
  OCP_APIM_SUBSCRIPTION_KEY: process.env.OCP_APIM_SUBSCRIPTION_KEY,
  AGILITY_BASE_URL: process.env.AGILITY_BASE_URL,
  ACCOUNT_ID: process.env.ACCOUNT_ID,
  TOKEN_SECRET: process.env.TOKEN_SECRET
};

export default Environment;
