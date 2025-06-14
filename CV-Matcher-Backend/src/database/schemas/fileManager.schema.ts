import mongoose from "mongoose";
import { formattedMongooseRequiredMessage } from "../../common/common";

const fileSchema = new mongoose.Schema({
  size: {
    type: Number,
    required: [true, formattedMongooseRequiredMessage],
  },
  filename: {
    type: String,
    required: [true, formattedMongooseRequiredMessage],
  },

  mimetype: {
    type: String,
    required: [true, formattedMongooseRequiredMessage],
  },
  fieldname: {
    type: String,
    required: [true, formattedMongooseRequiredMessage],
  },
  originalname: {
    type: String,
    required: [true, formattedMongooseRequiredMessage],
  },
  encoding: {
    type: String,
    required: [true, formattedMongooseRequiredMessage],
  },
});

const FileManager = mongoose.model("FileManager", fileSchema);
export default FileManager;
