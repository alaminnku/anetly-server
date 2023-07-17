import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
const xssClean = require("xss-clean");

// Config
dotenv.config();

// Port
const PORT = process.env.PORT || 5300;

// App
const app = express();

// Middleware
app.use(helmet());
app.use(xssClean());
app.use(mongoSanitize);

// Routes

// Start app
app.listen(PORT, () => console.log("Server started"));
