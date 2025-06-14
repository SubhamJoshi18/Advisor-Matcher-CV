import mongoose from "mongoose";
import { fileProcessConfig } from "../../constant/status.constant";

const statusManagerSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      fileProcessConfig.PROCESSING,
      fileProcessConfig.VALIDATED,
      fileProcessConfig.VALIDATING,
    ],
    default: "IDLE",
  },

  processStartedAt: {
    type: Date,
    default: new Date(),
  },

  processCompletedAt: {
    type: Date,
    default: new Date(),
  },
});

const statusManager = mongoose.model('StatusManager',statusManagerSchema)
export default statusManager
