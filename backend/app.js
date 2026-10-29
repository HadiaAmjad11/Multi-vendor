const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ErrorHandler = require("./middleware/error");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Load environment variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Import user router
const user = require("./controller/user");

// Test route
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working",
  });
});

// User routes
app.use("/api/v2/user", user);

// Error handling middleware
app.use(ErrorHandler);

module.exports = app;
