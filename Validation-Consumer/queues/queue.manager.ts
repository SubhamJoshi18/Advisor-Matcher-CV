import amqp from "amqplib";
import { consuemrLogger } from "../libs/common.logger";
import { getEnvValue } from "../utils/env.utils";
import initalizeConsuemr from "./consumer/queue.consumer";

class QueueManager {
  public connection: amqp.ChannelModel | null = null;
  public channel: amqp.Channel | null = null;

  public async getConnection(): Promise<amqp.ChannelModel | null> {
    return this.connection;
  }

  public async getChannel(): Promise<amqp.Channel | null> {
    return this.channel;
  }

  public async initalizeConnection() {
    try {
      if (!this.connection) {
        this.connection = await amqp.connect(getEnvValue("AMQP_URL") as string);
        this.channel = await this.connection.createChannel();
      }
    } catch (err: any) {
      consuemrLogger.error(`Error Initalzing the Queue Manager Server`);
      process.exit(1);
    }
  }

  public async startAllConsumers() {
    const connection = await this.getConnection();
    if (!connection) {
      await this.initalizeConnection();
    }
    await initalizeConsuemr(
      (await this.getChannel()) as unknown as amqp.Channel
    );
  }
}

const getQueueInstance = () => {
  return new QueueManager();
};

export { getQueueInstance, QueueManager };
