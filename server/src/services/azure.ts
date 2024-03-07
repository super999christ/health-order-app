import {
  EventHubConsumerClient,
  EventHubProducerClient
} from '@azure/event-hubs';

import Environment from '../constants/base';

const connectionString = Environment.AZURE_EVENT_HUB_CONNECTION;
const consumerGroupName = '$Default';
const eventHubName = 'emrapporderconfirmation';

export const globalStore = {
  orders: []
};

export const orderConsumerClient = new EventHubConsumerClient(
  consumerGroupName,
  connectionString,
  eventHubName
);

export const orderProducerClient = new EventHubProducerClient(
  connectionString,
  eventHubName
);

export const orderSubscription = orderConsumerClient.subscribe(
  {
    processEvents: async events => {
      for (const event of events) {
        console.log('Received event from EventHub: ', event.body);
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

export const mockPushOrders = async () => {
  // await pushOrderToEventHub({ name: 'Testing Order1', creator: 'Randall Christ' });
  // await pushOrderToEventHub({ name: 'Testing Order2', creator: 'Cody' });
  // await pushOrderToEventHub({ name: 'Testing Order3', creator: 'Randall' });
  // await pushOrderToEventHub({ name: 'Testing Order4', creator: 'Christ' });
  console.log('Subscription is running: ', orderSubscription.isRunning);
};
