import User from "../models/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default async function handler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If there are cookies
  const token = req.headers.authorization;

  // Return not authorized in there is no token
  if (!token) {
    // Log error
    console.log("Not authorized");

    res.status(401);
    throw new Error("Not authorized");
  }

  try {
    // Decode the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Find the user
    const user = await User.findById(decoded._id)
      .select("-__v -password -updatedAt -createdAt")
      .lean();

    // If there is a user in db
    if (user) {
      // Send User data to the next middleware
      req.user = user;

      // Call the next middleware
      next();
    }
  } catch (err) {
    // If token is invalid or expired
    console.log(err);

    throw err;
  }
}
