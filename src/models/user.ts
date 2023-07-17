import { Schema, model } from "mongoose";

interface IUserSchema {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUserSchema>(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please provide a first name"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Please provide a last name"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Please provide an email"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please provide a password"],
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
