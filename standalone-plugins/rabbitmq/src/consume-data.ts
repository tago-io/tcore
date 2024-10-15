import { core } from "@tago-io/tcore-sdk";
import { ConsumeMessage } from "amqplib";
import { consumer } from "./connection";

function consumeData(msg: ConsumeMessage | null): void {
  if (msg === null) {
    return console.error("Consumer cancelled by server");
  }

  const data = JSON.parse(msg.content.toString());
  const deviceID = msg.properties.messageId;

  core
    .addDeviceData(deviceID, data, { forceDBInsert: true })
    .then(() => {
      consumer.ack(msg);
    })
    .catch((e) => {
      console.error(`ERROR: ${JSON.stringify({ deviceID, data, error: e?.message | e })}`);

      return consumer.reject(msg, false);
    });
}

export { consumeData };
