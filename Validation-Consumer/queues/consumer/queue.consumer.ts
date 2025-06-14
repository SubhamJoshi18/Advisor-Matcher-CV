import amqp from "amqplib";
import {
  directExchange,
  validationQueueConstant,
} from "../../constants/queue.constant";
import { consuemrLogger } from "../../libs/common.logger";
import validationHandler from "../handler/queue.handler";

async function initalizeConsuemr(channel: amqp.Channel) {
  const { queueName, queueExchange } = validationQueueConstant;
  if (queueName.startsWith("cv")) {
    await channel.assertExchange(queueExchange, directExchange, {
      durable: true,
    });
    await channel.assertQueue(queueName, { durable: true });

    consuemrLogger.info(`Waiting For Payload or Message in the ${queueName}`)
    await channel.consume(queueName, async (message: amqp.Message | null) => {
      try {
        if (!message) {
          throw new Error(
            `Payload is Empty, Acknowledging the Validation Queue`
          );
        }
        await validationHandler(message, channel);
      } catch (err: any) {
        consuemrLogger.error(
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
