import { QueueModule } from "@tago-io/tcore-sdk";
import { configs } from "./configurations";
import { addToQueue, closeConnection, createConnection } from "./connection";

const amazonSQS = new QueueModule({
  id: "amazon-sqs",
  name: "Amazon SQS",
  configs,
});

amazonSQS.onLoad = createConnection;
amazonSQS.onDestroy = closeConnection;
amazonSQS.onAddDeviceData = addToQueue;

export default amazonSQS;
