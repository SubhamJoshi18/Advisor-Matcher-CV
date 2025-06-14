import FileManager from "../schemas/fileManager.schema";
import fileContent from "../../constant/file.constant";

class MongoInsert {
  public validateSchema(obj: object) {
    let allPass = true;
    if (typeof obj === "object") {
      for (const [key, value] of Object.entries(obj)) {
        if (!(key in fileContent)) {
          allPass = false;
        }
      }
    }
    return allPass;
  }

  public async insertOperation(obj: object) {
    if (this.validateSchema(obj)) {
      const isInsert = await FileManager.create({
        ...obj,
      });
      return isInsert;
    } else {
      return null;
    }
  }
}

const getMongoInsertOperationInstance = () => {
  return new MongoInsert();
};

export default getMongoInsertOperationInstance;
