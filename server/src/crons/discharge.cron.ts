import { schedule } from 'node-cron';

import { getActivePatients } from '../apis/orders';

schedule('0 0-23/1 * * *', async () => {
  try {
    const { data: patients } = await getActivePatients('EMRApp001');
    console.log({ patients });
  } catch (err) {
    console.log({ err });
  }
}).start();
