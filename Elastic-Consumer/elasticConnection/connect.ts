import { Client } from "@elastic/elasticsearch";
import { elasticLogger } from "../libs/common.libs";
import client from "./elastic.connect";

async function initalizeElasticConnection() {
  return new Promise(async (resolve, reject) => {
    try {
      const elasticClient = await client.ping();
      elasticLogger.info(`Elastic Search Status : ${elasticClient}`);
      resolve(true);
    } catch (err: any) {
      elasticLogger.error(
        `Error Connecting to the Elastic Consuemr : ${JSON.stringify(err)}`
      );
      throw err;
    }
  });
}

async function checkConnection() {
  try {
    const health = await client.cluster.health();
    console.log("🟢 Elasticsearch is healthy:", health.status);
    return true;
  } catch (error) {
    console.error("🔴 Could not connect to Elasticsearch:", error);
  }
}

async function getElasticClient(): Promise<Client | null> {
  return (await checkConnection()) ? client : null;
}

export { checkConnection, initalizeElasticConnection, getElasticClient };
