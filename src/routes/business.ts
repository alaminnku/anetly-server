import express from 'express';
import authUser from '../middleware/authUser';
import User from '../models/user';
import { notAuthorizedMessage, validationMessage } from '../utils';

// Initiate route
const router = express.Router();

// Types
interface IBusinessPayload {
  name: string;
  address: string;
  category: string;
}

interface IItemPayload {
  name: string;
  price: string;
  image: string;
  description: string;
}

// Add business
router.patch('/add', authUser, async (req, res) => {
  if (req.user) {
    // Get role
    const { role } = req.user;
    if (role === 'BUSINESS') {
      // Destructure data
      const { name, address, category }: IBusinessPayload = req.body;

      if (!name || !address || !category) {
        // Log error
        console.log(validationMessage);

        res.status(400);
        throw new Error(validationMessage);
      }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $set: {
              business: {
                name,
                address,
                category,
              },
            },
          },
          { returnDocument: 'after' }
        )
          .select('-password -createdAt -updatedAt -__v')
          .lean()
          .orFail();

        // Send the response
        res.status(201).json(updatedUser);
      } catch (err) {
        // Log error
        console.log(err);

        throw err;
      }
    } else {
      // If role isn't business
      console.log(notAuthorizedMessage);

      res.status(403);
      throw new Error(notAuthorizedMessage);
    }
  } else {
    // If role isn't business
    console.log(notAuthorizedMessage);

    res.status(403);
    throw new Error(notAuthorizedMessage);
  }
});

// Add item
router.patch('/add-item', authUser, async (req, res) => {
  if (req.user) {
    // Get role
    const { role } = req.user;

    if (role === 'BUSINESS') {
      // Destructure data
      const { name, price, image, description }: IItemPayload = req.body;

      if (!name || !price || !image || !description) {
        console.log(validationMessage);

        res.status(400);
        throw new Error(validationMessage);
      }

      try {
        // Create an item
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $push: {
              'business.items': {
                name,
                price,
                image,
                description,
              },
            },
          },
          {
            returnDocument: 'after',
          }
        )
          .select('-password -createdAt -updatedAt -__v')
          .lean()
          .orFail();

        // Get business
        const business = updatedUser?.business;

        // Return business
        res.status(201).json(business);
      } catch (err) {
        // Log error
        console.log(err);

        throw err;
      }
    } else {
      // If role isn't business
      console.log(notAuthorizedMessage);

      res.status(403);
      throw new Error(notAuthorizedMessage);
    }
  } else {
    // If role isn't business
    console.log(notAuthorizedMessage);

    res.status(403);
    throw new Error(notAuthorizedMessage);
  }
});

// Update item
router.patch('/update-item/:id', authUser, async (req, res) => {
  if (req.user) {
    // Get role
    const { role } = req.user;
    const { id } = req.params;

    if (role === 'BUSINESS') {
      // Destructure data
      const { name, price, image, description }: IItemPayload = req.body;

      // Make sure all fields are provided
      if (!name || !price || !image || !description) {
        console.log(validationMessage);

        res.status(400);
        throw new Error(validationMessage);
      }

      try {
        // Create an item
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.user._id, 'business.items._id': id },
          {
            $set: {
              'business.items.$.name': name,
              'business.items.$.price': price,
              'business.items.$.image': image,
              'business.items.$.description': description,
            },
          },
          {
            returnDocument: 'after',
          }
        )
          .select('-password -createdAt -updatedAt -__v')
          .lean()
          .orFail();

        // Get business
        const business = updatedUser?.business;

        // Return business
        res.status(201).json(business);
      } catch (err) {
        // Log error
        console.log(err);

        throw err;
      }
    } else {
      // If role isn't business
      console.log(notAuthorizedMessage);

      res.status(403);
      throw new Error(notAuthorizedMessage);
    }
  } else {
    // If role isn't business
    console.log(notAuthorizedMessage);

    res.status(403);
    throw new Error(notAuthorizedMessage);
  }
});

// Get all businesses
router.get('/all', authUser, async (req, res) => {
  if (req.user) {
    // Get role
    const { role } = req.user;

    if (role === 'CUSTOMER') {
      try {
        // Query database
        const response = await User.find().select('business').lean().orFail();

        // Get the businesses
        const businesses = response.filter((user) => user.business);

        // Return response
        res.status(200).json(businesses);
      } catch (err) {
        // Log error
        console.log(err);

        throw err;
      }
    } else {
      // If role isn't business
      console.log('Not authorized');

      res.status(403);
      throw new Error('Not authorized');
    }
  } else {
    // If role isn't business
    console.log('Not authorized');

    res.status(403);
    throw new Error('Not authorized');
  }
});

// if (req.user) {
//   // Get role
//   const { role } = req.user;
//   if (role === 'CUSTOMER') {
//     try {
//     } catch (err) {
//       // Log error
//       console.log(err);

//       throw err;
//     }
//   } else {
//     // If role isn't business
//     console.log('Not authorized');

//     res.status(403);
//     throw new Error('Not authorized');
//   }
// } else {
//   // If role isn't business
//   console.log('Not authorized');

//   res.status(403);
//   throw new Error('Not authorized');
// }

export default router;
