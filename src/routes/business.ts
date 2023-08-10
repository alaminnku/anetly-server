import express from 'express';
import authUser from '../middleware/authUser';
import User from '../models/user';

// Initiate route
const router = express.Router();

// Types
interface IBusinessPayload {
  name: string;
  address: string;
  category: string;
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
        console.log('Please provide all the fields');

        res.status(400);
        throw new Error('Please provide all fields');
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
        );

        console.log(updatedUser);
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
//     // Get role
//     const { role } = req.user;
//     if (role === 'BUSINESS') {

//     } else {
//       // If role isn't business
//       console.log('Not authorized');

//       res.status(403);
//       throw new Error('Not authorized');
//     }
//   } else {
//     // If role isn't business
//     console.log('Not authorized');

//     res.status(403);
//     throw new Error('Not authorized');
//   }

export default router;
