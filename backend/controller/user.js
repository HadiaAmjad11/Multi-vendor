const express = require("express");
const upload = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../model/user");
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");

const router = express.Router();


// =========================
// CREATE USER
// =========================
router.post(
  "/create-user",
  upload.single("file"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("========== CREATE USER ==========");

      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      const { name, email, password } = req.body;

      // Check if User is actually a Mongoose model
      console.log("User model:", User);
      console.log("findOne type:", typeof User.findOne);
      console.log("create type:", typeof User.create);

      // Check existing user
      const userEmail = await User.findOne({ email });

      console.log("Existing user:", userEmail);

      if (userEmail) {
        if (req.file) {
          const filename = req.file.filename;
          const filePath = `uploads/${filename}`;

          fs.unlink(filePath, (err) => {
            if (err) {
              console.log("Error deleting file:", err.message);
            } else {
              console.log("File deleted successfully");
            }
          });
        }

        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Check avatar
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an avatar",
        });
      }

      const userData = {
        name,
        email,
        password,
        avatar: req.file.filename,
      };

      console.log("Data before MongoDB:", userData);

      const newUser = await User.create(userData);

      console.log("Data saved in MongoDB:", newUser);

      // Create activation token
      const activationToken = createActivationToken(newUser);

      const activationUrl =
        `http://localhost:3000/activation/${activationToken}`;

      console.log("Activation URL:", activationUrl);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: newUser,
        activationUrl: activationUrl,
      });

    } catch (error) {
      console.error("CREATE USER ERROR:", error);

      return next(
        new ErrorHandler(error.message, 400)
      );
    }
  })
);


// =========================
// CREATE ACTIVATION TOKEN
// =========================
const createActivationToken = (user) => {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      password: user.password,
      avatar: user.avatar,
    },
    process.env.Activation_SECRET,
    {
      expiresIn: "5m",
    }
  );
};


// =========================
// ACTIVATE USER
// =========================
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      if (!activation_token) {
        return next(
          new ErrorHandler("Activation token is required", 400)
        );
      }

      const newUser = jwt.verify(
        activation_token,
        process.env.Activation_SECRET
      );

      if (!newUser) {
        return next(
          new ErrorHandler("Invalid token", 400)
        );
      }

      const { name, email, password, avatar } = newUser;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return next(
          new ErrorHandler("User already exists", 400)
        );
      }

      const createdUser = await User.create({
        name,
        email,
        password,
        avatar,
      });

      return res.status(201).json({
        success: true,
        message: "User activated successfully",
        user: createdUser,
      });

    } catch (error) {
      console.error("ACTIVATION ERROR:", error);

      return next(
        new ErrorHandler(error.message, 400)
      );
    }
  })
);


module.exports = router;