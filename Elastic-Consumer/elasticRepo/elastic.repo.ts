import { Client } from "@elastic/elasticsearch";
import { CVPayload } from "../interface/elastic.interface";
import { elasticLogger } from "../libs/common.libs";

export const saveCvToElastic = async (
  client: Client,
  cvPayload: CVPayload
): Promise<boolean> => {
  try {
    const indexExists = await client.indices.exists({ index: "cv_profiles" });

    if (!indexExists) {
      await client.indices.create({
        index: "cv_profiles",
        body: {
          mappings: {
            properties: {
              pdf_path: { type: "keyword" }, // exact match
              summary: {
                type: "text",
                fields: {
                  keyword: { type: "keyword", ignore_above: 256 },
                },
              },
              experience: {
                type: "text",
                fields: {
                  keyword: { type: "keyword", ignore_above: 256 },
                },
              },
              projects: {
                type: "text",
                fields: {
                  keyword: { type: "keyword", ignore_above: 256 },
                },
              },
              skills: {
                type: "text",
                fields: {
                  keyword: { type: "keyword", ignore_above: 256 },
                },
              },
              education: {
                type: "text",
                fields: {
                  keyword: { type: "keyword", ignore_above: 256 },
                },
              },
              certifications: {
                type: "text",
                fields: {
                  keyword: { type: "keyword", ignore_above: 256 },
                },
              },
              languages: {
                type: "text",
                fields: {
                  keyword: { type: "keyword", ignore_above: 256 },
                },
              },
              others: {
                type: "text",
                fields: {
                  keyword: { type: "keyword", ignore_above: 256 },
                },
              },
              created_at: { type: "date" },
            },
          },
        },
      });
      elasticLogger.info("ℹ️ Created index cv_profiles with mappings");
    }

    const document = {
      pdf_path: cvPayload.pdf_path,
      ...cvPayload.sections,
      created_at: new Date().toISOString(),
    };

    const response = await client.index({
      index: "cv_profiles",
      document,
    });

    // Refresh index to make document searchable immediately (optional)
    await client.indices.refresh({ index: "cv_profiles" });

    elasticLogger.info(`CV indexed successfully with ID: ${response._id}`);
    return true;
  } catch (error: any) {
    elasticLogger.error(`Error indexing CV to Elasticsearch: ${error.message}`);
    return false;
  }
};
