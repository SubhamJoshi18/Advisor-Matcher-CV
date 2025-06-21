import amqp from "amqplib";
import { consuemrLogger } from "../../libs/common.logger";
import {
  directExchange,
  extractorQueueConstant,
} from "../../constants/queue.constant";

async function initalizeQueueConfig(channel: amqp.Channel) {
  await channel.assertExchange(
    extractorQueueConstant.queueExchange,
    directExchange,
    { durable: true }
  );

  await channel.assertQueue(extractorQueueConstant.queueName, {
    durable: true,
  });
}

async function publishToExtractorQueue(channel: amqp.Channel, payload: object) {
  return new Promise(async (resolve, reject) => {
    try {
      await initalizeQueueConfig(channel);
      const decodedPayload = Buffer.from(JSON.stringify(payload));
      channel.sendToQueue(extractorQueueConstant.queueName, decodedPayload);
      consuemrLogger.info(
        `Publish The Message to the Queue ${
          extractorQueueConstant.queueName
        } With Payload: ${JSON.stringify(payload)}`
      );
      resolve(true);
    } catch (err: any) {
      consuemrLogger.error(
        `Error Publishing the Message to the Extractor Queue, Error Due to : ${JSON.stringify(
          err
        )}`
      );
      throw err;
    }
  });
}

export default publishToExtractorQueue;
