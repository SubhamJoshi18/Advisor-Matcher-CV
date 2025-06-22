import FileManager from "../schemas/fileManager.schema";
import fileContent from "../../constant/file.constant";
import { fileProcessConfig } from "../../constant/status.constant";

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
    const isInsert = await manager.create({
      ...obj,
    });
    return isInsert;
  }

  public async updateOperation(manager: any, id: string) {
    const updateStatus = await manager.updateOne(
      {
        _id: id,
      },
      {
        status: fileProcessConfig.COMPLETED,
      },
      {
        $new: true,
      }
    );
    return updateStatus;
  }
}

const getMongoInsertOperationInstance = () => {
  return new MongoInsert();
};

export default getMongoInsertOperationInstance;
