import express from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { createToken, deleteFields } from "../utils";

// Initiate route
const router = express.Router();

// Types
interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Register
router.post("/register", async (req, res, next) => {
  // Destructure data
  const { firstName, lastName, email, password }: IRegisterPayload = req.body;

  // Validation
  if (!firstName || !lastName || !email || !password) {
    // Log error
    console.log("Please provide all the fields");

    res.status(400);
    throw new Error("Please provide all the fields");
  }

  try {
    // Create salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const response = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Convert BSON to object
    const user = response.toObject();

    // Create token
    const token = createToken(user._id);

    // Delete fields
    deleteFields(user, ["createdAt", "password"]);

    // Send the response
    res.status(201).json({ ...user, token });
  } catch (err) {
    // Log error
    console.log(err);

    throw err;
  }
});

export default router;
