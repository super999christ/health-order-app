import { schedule } from 'node-cron';

import { dischargePatients, getActivePatients } from '../apis/orders';

schedule('0 0-23/1 * * *', async () => { // every 1 hour
// schedule('*/5 * * * * *', async () => { // ever 5 secs
  try {
    const { data: patients } = await getActivePatients('EMRApp001');
    console.log("Discharge patients: ", { patients });
    const { data: result } = await dischargePatients(patients);
    console.log("Discharge result: ", { result });
  } catch (err) {
    console.log({ err });
  }
}).start();
