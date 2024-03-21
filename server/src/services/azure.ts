import {
  EventHubConsumerClient,
  EventHubProducerClient
} from '@azure/event-hubs';

import Environment from '../constants/base';

const connectionString = Environment.AZURE_EVENT_HUB_CONNECTION;
const consumerGroupName = '$Default';

enum EventHubName {
  CONFIRMATION = 'emrapporderconfirmation',
  STATUS = 'emrapporderstatus'
}

export interface IEventHubOrder {
  OrderID: number;
  PatientID: string;
  EpicIDNumber: string;
}

export const globalStore = {
  orders: [] as IEventHubOrder[]
};

export const orderConsumerClient = new EventHubConsumerClient(
  consumerGroupName,
  connectionString,
  EventHubName.CONFIRMATION
);

export const orderProducerClient = new EventHubProducerClient(
  connectionString,
  EventHubName.CONFIRMATION
);

export const orderStatusConsumerClient = new EventHubConsumerClient(
  consumerGroupName,
  connectionString,
  EventHubName.STATUS
);

export const orderStatusProducerClient = new EventHubProducerClient(
  connectionString,
  EventHubName.STATUS
);

export const orderSubscription = orderConsumerClient.subscribe(
  {
    processEvents: async events => {
      for (const event of events) {
        // console.log('Received event from EventHub: ', event.body);
        globalStore.orders.push(event.body);
      }
    },
    processError: async err => {
      console.log('Error while processing EventHub order: ', err);
    }
  },
  {
    startPosition: {
      enqueuedOn: new Date(1970, 1, 1)
    }
  }
);

export const orderStatusSubscription = orderStatusConsumerClient.subscribe(
  {
    processEvents: async events => {
      for (const event of events) {
        console.log('Received status event from EventHub: ', event.body);
      }
    },
    processError: async err => {
      console.log('Error while processing EventHub order status: ', err);
    }
  },
  {
    startPosition: {
      enqueuedOn: new Date(1970, 1, 1)
    }
  }
);

export const pushOrderToEventHub = async order => {
  const batch = await orderProducerClient.createBatch();
  const message = { body: order };
  if (batch.tryAdd(message)) {
    console.log('Order has been added to the batch: ', message);
    await orderProducerClient.sendBatch(batch);
  } else {
    throw Error('Something went wrong');
  }
};

export const startEventHubService = () => {
  console.log('Started pulling from Azure EventHub...');
};
