import mongoose, { Schema, Document } from "mongoose";

export interface IProfessor extends Document {
  name: string;
  email: string;
  department: string;
  expertise: string;
  created_at?: Date;
}

const ProfessorSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  expertise: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const Professor = mongoose.model<IProfessor>(
  "Professor",
  ProfessorSchema
);
