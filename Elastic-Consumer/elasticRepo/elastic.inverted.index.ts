import { Client } from "@elastic/elasticsearch";
import { getElasticClient } from "../elasticConnection/connect";
import { elasticLogger } from "../libs/common.libs";

export const findMatchingProfessor = async (cvSections: any): Promise<any> => {
  const combinedText = `
    ${cvSections.summary || ""}
    ${cvSections.experience || ""}
    ${cvSections.projects || ""}
    ${cvSections.education || ""}
    ${cvSections.skills || ""}
    ${cvSections.certifications || ""}
    ${cvSections.languages || ""}
  `;

  try {
    const elasticClient = getElasticClient() as unknown as Client;
    const result = await elasticClient.search({
      index: "professor_advisor_index",
      query: {
        match: {
          expertise: {
            query: combinedText,
            fuzziness: "AUTO",
          },
        },
      },
    });

    const hits = result.hits.hits;
    elasticLogger.info(
      `Professor Match Results: ${JSON.stringify(hits.map((h) => h._source))}`
    );

    return hits.map((hit) => hit._source);
  } catch (err: any) {
    elasticLogger.error(`Error finding matching professor: ${err.message}`);
    return [];
  }
};

export const matchProfessor = async (
  elasticClient: Client,
  cvSections: any
) => {
  const combinedText = `
    ${cvSections.summary || ""}
    ${cvSections.experience || ""}
    ${cvSections.projects || ""}
    ${cvSections.education || ""}
    ${cvSections.skills || ""}
    ${cvSections.certifications || ""}
    ${cvSections.languages || ""}
  `;

  try {
    const response = await elasticClient.search({
      index: "professor_advisor_index",
      query: {
        match: {
          expertise: {
            query: combinedText,
            fuzziness: "AUTO",
          },
        },
      },
    });

    const matched = response.hits.hits.map((hit) => hit._source);
    elasticLogger.info(
      `Matched Professors: ${JSON.stringify(matched, null, 2)}`
    );
    return matched;
  } catch (error: any) {
    elasticLogger.error(`Error matching professor: ${error.message}`);
    return [];
  }
};
