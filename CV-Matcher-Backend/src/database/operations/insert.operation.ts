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

  public async insertOperation(obj: object, manager: any) {
    return new Promise(async (resolve, reject) => {
      const isInsert = await manager.create({
        ...obj,
      });
      resolve(isInsert ? true : false);
    });
  }
}

const getMongoInsertOperationInstance = () => {
  return new MongoInsert();
};

export default getMongoInsertOperationInstance;
