import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// Create token
export const createToken = (_id: Types.ObjectId) =>
  jwt.sign({ _id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

// Delete unnecessary fields
export const deleteFields = (data: object, moreFields?: string[]): void => {
  // Default fields
  let fields = ["__v", "updatedAt"];

  // If more fields are provided
  if (moreFields) {
    fields = [...fields, ...moreFields];
  }

  // Delete the fields
  fields.forEach((field) => delete data[field as keyof object]);
};
