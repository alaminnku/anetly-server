import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
const xssClean = require('xss-clean');
import 'express-async-errors'; // Put before any route import
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './config/db';
import User from './routes/user';
import Business from './routes/business';
import error from './middleware/error';

// Config
dotenv.config();

// Port
const PORT = process.env.PORT || 5300;

// Connect database
connectDB();

// App
const app = express();

// Middleware
app.use(helmet());
app.use(xssClean());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/users', User);
app.use('/businesses', Business);

// Error Middleware
app.use(error);

// Start app
app.listen(PORT, () => console.log('Server started'));
