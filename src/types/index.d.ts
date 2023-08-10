import { Request } from 'express';
import { Types } from 'mongoose';

export interface IItem {
  name: string;
  image: string;
  price: number;
  description: string;
}

export interface IBusiness {
  name: string;
  address: string;
  category: string;
  items?: IItem[];
  status: 'OPEN' | 'CLOSED';
}

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  business?: IBusiness;
  role: 'CUSTOMER' | 'BUSINESS';
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
