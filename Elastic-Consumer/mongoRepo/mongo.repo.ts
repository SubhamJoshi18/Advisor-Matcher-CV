import { Professor } from "../mongoDB/schemas/professor.schema";

class MongoRepo {
  public async saveResult(payload: object | object[]) {
    if (Array.isArray(payload)) {
      const result = await Professor.insertMany(payload);
      return result;
    } else {
      const result = await Professor.create(payload);
      return result;
    }
  }
}

export default MongoRepo;
