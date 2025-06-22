import { elasticLogger } from "../../libs/common.libs";
import { saveCvToElastic } from "../../elasticRepo/elastic.repo";
import { matchProfessor } from "../../elasticRepo/elastic.inverted.index";
import amqp from "amqplib";
import { getElasticClient } from "../../elasticConnection/connect";
import { Client } from "@elastic/elasticsearch";
import MongoRepo from "../../mongoRepo/mongo.repo";

const mongoRepo = new MongoRepo();

const elasticHandler = async (message: amqp.Message, channel: amqp.Channel) => {
  return new Promise(async (resolve, reject) => {
    try {
      const parseContent = message.content;
      if (!parseContent) return resolve(true);

      const parsePayload = JSON.parse(parseContent.toString());
      const cvParsePayload = JSON.parse(parsePayload);

      elasticLogger.info(
        `Received message for Elasticsearch: ${JSON.stringify(parsePayload)}`
      );

      const elasticClient = await getElasticClient();

      const saveStatus = await saveCvToElastic(
        elasticClient as Client,
        cvParsePayload
      );

      if (!saveStatus) return reject("Failed to index CV.");

      const matchedProfessors = await matchProfessor(
        elasticClient as Client,
        cvParsePayload.sections
      );

      elasticLogger.info(
        `✅ Matched Professors for uploaded CV: ${JSON.stringify(
          matchedProfessors
        )}`
      );

      const saveResultMongo = await mongoRepo.saveResult(matchedProfessors);

      resolve(true);
    } catch (err: any) {
      elasticLogger.error(`❌ Error in Elastic Consumer: ${err.message}`);
      reject(err);
    }
  });
};

export default elasticHandler;
