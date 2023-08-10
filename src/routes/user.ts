import express from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { createToken, deleteFields } from '../utils';
import authUser from '../middleware/authUser';
import { IUser } from '../types';

// Initiate route
const router = express.Router();

// Types
interface ILoginPayload {
  email: string;
  password: string;
}

interface IRegisterPayload extends IUser {}

// Register
router.post('/register', async (req, res) => {
  // Destructure data
  const { firstName, lastName, email, password, role }: IRegisterPayload =
    req.body;

  // Validation
  if (!firstName || !lastName || !email || !password || !role) {
    // Log error
    console.log('Please provide all the fields');

    res.status(400);
    throw new Error('Please provide all the fields');
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
      role,
      password: hashedPassword,
    });

    // Convert BSON to object
    const user = response.toObject();

    // Create token
    const token = createToken(user._id);

    // Delete fields
    deleteFields(user, ['createdAt', 'password']);

    // Send the response
    res.status(201).json({ ...user, token });
  } catch (err) {
    // Log error
    console.log(err);

    throw err;
  }
});

// Login
router.post('/login', async (req, res) => {
  // Destructure data
  const { email, password }: ILoginPayload = req.body;

  if (!email || !password) {
    // Log error
    console.log('Please provide all fields');

    res.status(400);
    throw new Error('Please provide all fields');
  }

  try {
    // Find the user
    const user = await User.findOne({ email }).lean().orFail();

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = createToken(user._id);

      // Delete fields
      deleteFields(user, ['password', 'createdAt']);

      // Send data with response
      res.status(200).json({ ...user, token });
    } else {
      // Log error
      console.log('Invalid credentials');

      res.status(400);
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    // Log error
    console.log(err);

    throw err;
  }
});

// Get user details
router.get('/me', authUser, async (req, res) => {
  // Send the user with response
  res.status(200).json(req.user);
});

export default router;
