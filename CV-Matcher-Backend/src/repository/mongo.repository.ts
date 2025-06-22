import { Professor } from "../database/schemas/professor.schema";
import { cvLogger } from "../libs/logger/logger.libs";

class MongoRepo {
  public async getMatchedProfessor() {
    const result = await Professor.find({});
    return result;
  }

  public async deleteAllMatchProfessor() {
    try {
      const deleteResult = await Professor.deleteMany({});
      cvLogger.info(`✅ Deleted ${deleteResult.deletedCount} professor(s)`);
      return deleteResult;
    } catch (error) {
      cvLogger.error("❌ Error deleting professors:", error);
      throw error;
    }
  }
}

export default MongoRepo;
