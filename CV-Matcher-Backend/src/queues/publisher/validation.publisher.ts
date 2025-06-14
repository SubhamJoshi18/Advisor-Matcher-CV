import amqp from "amqplib";
import { cvLogger } from "../../libs/logger/logger.libs";
import {
  directExchange,
  validationQueueConstant,
} from "../../constant/queue.constant";

async function initalizeQueueConfig(channel: amqp.Channel) {
  await channel.assertExchange(
    validationQueueConstant.queueExchange,
    directExchange,
    { durable: true }
  );
  await channel.assertQueue(validationQueueConstant.queueName, {
    durable: true,
  });
}

async function publishToValidationQueue(
  channel: amqp.Channel,
  message: object
) {
  return new Promise(async (resolve, reject) => {
    try {
      await initalizeQueueConfig(channel);
      const decodedPayload = Buffer.from(JSON.stringify(message));
      channel.sendToQueue(validationQueueConstant.queueName, decodedPayload);
      cvLogger.info(
        `Publish the Message to the Queue ${
          validationQueueConstant.queueName
        } With Payload : ${JSON.stringify(message)}`
      );
      resolve(true);
    } catch (err: any) {
      reject(false);
    } finally {
      cvLogger.info(`Publish Process Has been Completed`);
    }
  });
}

export default publishToValidationQueue;
