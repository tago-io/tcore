import { QueueModule } from "@tago-io/tcore-sdk";
import { configs } from "./configurations";
import { addToQueue, closeConnection, createConnection } from "./connection";

const rabbitMQ = new QueueModule({
  id: "rabbit-mq",
  name: "RabbitMQ",
  configs,
});

rabbitMQ.onLoad = createConnection;
rabbitMQ.onDestroy = closeConnection;
rabbitMQ.onAddDeviceData = addToQueue;

export default rabbitMQ;
