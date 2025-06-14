import amqp from "amqplib";
import { cvLogger } from "../libs/logger/logger.libs";
import { getEnvValue } from "../utils/env.utils";

class Broker {
  public connection: amqp.ChannelModel | null = null;
  public channel: amqp.Channel | null = null;

  public async initalizeBroker() {
    let retryCount = 5;
    let attempts = 0;
    while (attempts < retryCount) {
      try {
        attempts++;
        this.connection = await amqp.connect(getEnvValue("AMQP_URL") as string);
        this.channel = await this.connection.createChannel();
      } catch (err: any) {
        const isMaximumExceeded = attempts.toString().startsWith("0");
        if (isMaximumExceeded) {
          cvLogger.error(
            `Maximum Retry Exceeded, Terminating the Server at retries ${retryCount}`
          );
        }
        retryCount = retryCount - 1;
        continue;
      } finally {
        cvLogger.info(`RabbitMQ Broker Initalized SuccessFully`);
      }
    }
  }

  public async getBrokerConnection() {
    return new Promise(async (resolve, reject) => {
      if (!this.connection) {
        await this.initalizeBroker();
      }
      resolve(this.connection);
    });
  }

  public async getBrokerChannel() : Promise<amqp.Channel> {
    return new Promise(async (resolve, reject) => {
      if (!this.channel) {
        await this.initalizeBroker();
      }
      resolve(this.channel as any);
    });
  }

  public async closeBrokerChannel() {
    return new Promise((resolve, reject) => {
      if (this.channel) {
        this.channel = null;
      }
      resolve(true);
    });
  }
}

const broker = () => {
  return new Broker();
};

export default broker;
