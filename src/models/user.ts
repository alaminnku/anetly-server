import { Schema, model } from 'mongoose';
import { IUser, IItem } from '../types';

interface IUserSchema extends IUser {}
interface IItemSchema extends IItem {}

// Create item schema
const itemSchema = new Schema<IItemSchema>({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide an item name'],
  },
  image: {
    type: String,
    trim: true,
    required: [true, 'Please provide an item image'],
  },
  price: {
    type: Number,
    trim: true,
    required: [true, 'Please provide an item price'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Please provide an item description'],
  },
});

// Create user schema
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
      enum: ['CUSTOMER', 'BUSINESS'],
      required: [true, 'Please provide a role'],
    },
    business: {
      name: {
        type: String,
        trim: true,
        required: [true, 'Please provide a business name'],
      },
      address: {
        type: String,
        trim: true,
        required: [true, 'Please provide a business address'],
      },
      category: {
        type: String,
        trim: true,
        required: [true, 'Please provide a business category'],
      },
      items: itemSchema,
    },
  },
  {
    timestamps: true,
  }
);

export default model('User', userSchema);
