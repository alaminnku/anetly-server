import express from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { createToken, deleteFields } from "../utils";

// Initiate route
const router = express.Router();

interface ILoginPayload {
  email: string;
  password: string;
}

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

// Login
router.post("/login", async (req, res) => {
  // Destructure data
  const { email, password }: ILoginPayload = req.body;

  if (!email || !password) {
    // Log error
    console.log("Please provide all fields");

    res.status(400);
    throw new Error("Please provide all fields");
  }

  try {
    // Find the user
    const user = await User.findOne({ email }).lean().orFail();

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = createToken(user._id);

      // Delete fields
      deleteFields(user, ["password", "createdAt"]);

      // Send data with response
      res.status(200).json({ ...user, token });
    } else {
      // Log error
      console.log("Invalid credentials");

      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    // Log error
    console.log(err);

    throw err;
  }
});

export default router;
