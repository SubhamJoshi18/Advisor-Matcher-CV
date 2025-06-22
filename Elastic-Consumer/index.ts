import { error } from "console";
import {
  initalizeElasticConnection,
  checkConnection,
} from "./elasticConnection/connect";
import { elasticLogger } from "./libs/common.libs";
import { getQueueInstance, QueueManager } from "./queues/queue.manager";
import seedProfessors from "./elasticRepo/elastic.seeder.repo";
import connectMongoDB from "./mongoDB/connect";

async function startElasticConsumer() {
  const queueInstance = getQueueInstance();
  if (queueInstance instanceof QueueManager) {
    elasticLogger.info(`Starting The Consumer For the Elastic Queue`);
    connectMongoDB().then(() => {
      initalizeElasticConnection()
        .then(async () => {
          checkConnection()
            .then(async () => {
              await seedProfessors();
              await queueInstance.startAllConsumers();
            })
            .catch((err: any) => {
              throw err;
            });
        })
        .catch((err: any) => {
          elasticLogger.error(
            `Error in Connecting to the Elastic Searcn and Starting the Server`
          );
        });
    });
  }
}

(async () => {
  await startElasticConsumer();
})();
