import amqp from "amqplib";
import path from "path";
import PDFParser from "pdf2json";
import pdfHandler from "../../pdfHandler/pdf.handler";
import { getQueueInstance } from "../queue.manager";
import publishToExtractorQueue from "../publisher/extractor.publisher";
import { consuemrLogger } from "../../libs/common.logger";

const validationHandler = async (
  message: amqp.Message,
  channel: amqp.Channel
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const content = message.content.toString();
      const parseContent = JSON.parse(content);

      const pdfName = parseContent.name;

      const bucketPath = path
        .join(process.cwd(), "S3Bucket")
        .replace("/Validation-Consumer", "");

      const finalPdfPath = path.join(bucketPath, pdfName);

      const pdfResult = await pdfHandler(finalPdfPath);

      if (typeof pdfResult === "boolean" && pdfResult) {
        const queuePayload = Object.preventExtensions({
          path: finalPdfPath,
        });

        const channelBroker = getQueueInstance();
        const brokerChannel = await channelBroker.getChannel();
        const publishResult = await publishToExtractorQueue(
          brokerChannel as any,
          queuePayload
        );
        const closeBroker = await channelBroker.closeChannel();
        resolve(closeBroker);
      } else {
        const isArrayResult = Array.isArray(pdfResult) && pdfResult.length > 0;
        if (isArrayResult) {
          for (const message of pdfResult) {
            consuemrLogger.info(`Warning PDF Has Some Issue : ${message}`);

            const queuePayload = Object.preventExtensions({
              path: finalPdfPath,
            });

            const channelBroker = getQueueInstance();
            const brokerChannel = await channelBroker.getChannel();
            const publishResult = await publishToExtractorQueue(
              brokerChannel as any,
              queuePayload
            );
            const closeBroker = await channelBroker.closeChannel();
            resolve(closeBroker);
          }
        }
      }
    } catch (err: any) {
      reject(err);
    }
  });
};

export default validationHandler;
