import { Request } from 'express';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'BUSINESS';
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
