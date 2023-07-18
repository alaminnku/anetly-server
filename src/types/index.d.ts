import { Request } from "express";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
