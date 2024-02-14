import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

dotenv.config({ path: path.join(dirname, '../../.env') });

const Environment = {
  OCP_APIM_SUBSCRIPTION_KEY: process.env.OCP_APIM_SUBSCRIPTION_KEY,
  AGILITY_BASE_URL: process.env.AGILITY_BASE_URL
};

export default Environment;
