import mongoose from "mongoose";
import { formattedMongooseRequiredMessage } from "../../common/common";

const fileSchema = new mongoose.Schema({
  fileType: {
    type: String,
    required: [true, formattedMongooseRequiredMessage],
  },

  fileSize: {
    type: Number,
    required: [true, formattedMongooseRequiredMessage],
  },

  fileName: {
    type: Number,
    required: [true, formattedMongooseRequiredMessage],
  },
});

const FileManager = mongoose.model("FileManager", fileSchema);
export default FileManager;
