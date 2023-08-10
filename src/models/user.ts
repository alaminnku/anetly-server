import { Schema, model } from 'mongoose';
import { IUser } from '../types';

interface IUserSchema extends IUser {}

const userSchema = new Schema<IUserSchema>(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'Please provide a first name'],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Please provide a last name'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, 'Please provide an email'],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Please provide a password'],
    },
    role: {
      type: String,
      enum: ['USER', 'BUSINESS'],
      required: [true, 'Please provide a role'],
    },
  },
  {
    timestamps: true,
  }
);

export default model('User', userSchema);
