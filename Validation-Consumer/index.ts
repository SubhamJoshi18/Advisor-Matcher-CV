import { consuemrLogger } from "./libs/common.logger";
import { getQueueInstance, QueueManager } from "./queues/queue.manager";

async function startValidationQueue() {
  const queueInstance = getQueueInstance();
  if (queueInstance instanceof QueueManager) {
    consuemrLogger.info(`Starting The Consumer For the Validation Queue`);
    await queueInstance.startAllConsumers();
  }
}

(async () => {
  await startValidationQueue();
})();
