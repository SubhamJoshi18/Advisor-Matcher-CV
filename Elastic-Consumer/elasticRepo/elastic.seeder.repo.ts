import { Client } from "@elastic/elasticsearch";
import { getElasticClient } from "../elasticConnection/connect";
import { elasticLogger } from "../libs/common.libs";
import client from "../elasticConnection/elastic.connect";

const professors = [
  {
    name: "Dr. Aayush Thapa",
    email: "aayush@university.edu",
    department: "Artificial Intelligence",
    expertise: "Machine Learning, NLP, Deep Learning, Computer Vision",
  },
  {
    name: "Prof. Sita Pandey",
    email: "sita@university.edu",
    department: "Data Science",
    expertise: "Big Data, Statistical Modeling, Data Analysis",
  },
  {
    name: "Dr. Ravi Shrestha",
    email: "ravi@university.edu",
    department: "Cybersecurity",
    expertise: "Network Security, Cryptography, Ethical Hacking",
  },
];

async function seedProfessors() {
  const elasticClient = client;

  try {
    // Check if index exists
    const indexExists = await elasticClient.indices.exists({
      index: "professor_advisor_index",
    });

    if (!indexExists) {
      // Create index with optional mappings/settings
      await elasticClient.indices.create({
        index: "professor_advisor_index",
        body: {
          mappings: {
            properties: {
              name: { type: "text" },
              email: { type: "keyword" },
              department: { type: "text" },
              expertise: { type: "text" },
              created_at: { type: "date" },
            },
          },
        },
      });
      elasticLogger.info("ℹ️ Created index professor_advisor_index");
    }

    // Now count documents
    const countResponse = await elasticClient.count({
      index: "professor_advisor_index",
      query: {
        match_all: {},
      },
    });

    if (countResponse.count > 0) {
      elasticLogger.info(
        "ℹ️ Professors already exist in index. Skipping seeding."
      );
      return;
    }

    // Index professors
    for (const professor of professors) {
      await elasticClient.index({
        index: "professor_advisor_index",
        document: {
          ...professor,
          created_at: new Date().toISOString(),
        },
      });
    }

    await elasticClient.indices.refresh({ index: "professor_advisor_index" });

    elasticLogger.info("✅ Professors seeded successfully.");
  } catch (error: any) {
    elasticLogger.error(
      `❌ Error in seeding professors: ${JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      )}`
    );
  }
}

export default seedProfessors;
