import amqp from "amqplib";
import { elasticLogger } from "../libs/common.libs";
import { getEnvValue } from "../utils/env.utils";
import initalizeConsuemr from "./consumer/elastic.consumer";

class QueueManager {
  public connection: amqp.ChannelModel | null = null;
  public channel: amqp.Channel | null = null;

  public async getConnection(): Promise<amqp.ChannelModel | null> {
    return this.connection;
  }

  public async getChannel(): Promise<amqp.Channel | null> {
    if (!this.connection) {
      await this.initalizeConnection();
      return this.channel;
    } else {
      return this.channel;
    }
  }

  public async closeChannel(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.channel) {
        this.channel = null;
      }
      resolve(true);
    });
  }

  public async initalizeConnection() {
    try {
      if (!this.connection) {
        this.connection = await amqp.connect(getEnvValue("AMQP_URL") as string);
        this.channel = await this.connection.createChannel();
      }
    } catch (err: any) {
      elasticLogger.error(`Error Initalzing the Queue Manager Server`);
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
