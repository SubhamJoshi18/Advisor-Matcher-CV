import amqp from "amqplib";
import {
  directExchange,
  elasticQueueConstant,
} from "../../constant/queue.constant";
import { elasticLogger } from "../../libs/common.libs";
import elasticHandler from "../handlers/queue.handler";

async function initalizeConsuemr(channel: amqp.Channel) {
  const { queueName, queueExchange } = elasticQueueConstant;
  if (queueName.startsWith("cv")) {
    await channel.assertExchange(queueExchange, directExchange, {
      durable: true,
    });
    await channel.assertQueue(queueName, { durable: true });

    elasticLogger.info(`Waiting For Payload or Message in the ${queueName}`);
    await channel.consume(queueName, async (message: amqp.Message | null) => {
      try {
        if (!message) {
          throw new Error(
            `Payload is Empty, Acknowledging the Validation Queue`
          );
        }
        await elasticHandler(message, channel);
      } catch (err: any) {
        elasticLogger.error(
          `Error While Consuming the Payload For the Validation Consumer`
        );
      } finally {
        if (message) {
          await channel.ack(message);
        }
      }
    });
  }
}

export default initalizeConsuemr;
