const express = require("express");
const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../multer");
const User = require("../model/user");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");

const router = express.Router();

const removeUpload = async (file) => {
  if (!file) return;
  await fs.unlink(file.path).catch(() => {});
};

router.post(
  "/create-user",
  upload.single("file"),
  catchAsyncErrors(async (req, res, next) => {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      await removeUpload(req.file);
      return next(new ErrorHandler("All fields are required", 400));
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      await removeUpload(req.file);
      return next(new ErrorHandler("Please enter a valid email", 400));
    }

    if (password.length < 4) {
      await removeUpload(req.file);
      return next(
        new ErrorHandler("Password should be at least 4 characters", 400)
      );
    }

    if (!req.file) {
      return next(new ErrorHandler("Please upload an avatar", 400));
    }

    try {
      if (await User.findOne({ email })) {
        await removeUpload(req.file);
        return next(new ErrorHandler("User already exists", 400));
      }

      if (!process.env.ACTIVATION_SECRET) {
        throw new Error("ACTIVATION_SECRET is not configured");
      }

      const pendingUser = {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        avatar: req.file.filename,
      };
      const activationToken = jwt.sign(
        pendingUser,
        process.env.ACTIVATION_SECRET,
        { expiresIn: "5m" }
      );
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const activationUrl = `${clientUrl.replace(/\/$/, "")}/activation/${activationToken}`;

      await sendMail({
        email,
        subject: "Activate your account",
        message: `Hello ${name},\n\nPlease activate your account using this link:\n${activationUrl}`,
      });

      return res.status(201).json({
        success: true,
        message: `Please check ${email} to activate your account`,
      });
    } catch (error) {
      await removeUpload(req.file);
      return next(error);
    }
  })
);

router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    const { activation_token: activationToken } = req.body;

    if (!activationToken) {
      return next(new ErrorHandler("Activation token is required", 400));
    }

    if (!process.env.ACTIVATION_SECRET) {
      return next(new ErrorHandler("ACTIVATION_SECRET is not configured", 500));
    }

    const pendingUser = jwt.verify(
      activationToken,
      process.env.ACTIVATION_SECRET
    );
    const { name, email, password, avatar } = pendingUser;

    if (!name || !email || !password || !avatar) {
      return next(new ErrorHandler("Invalid activation token", 400));
    }

    if (await User.findOne({ email })) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = await User.create({ name, email, password, avatar });
    return sendToken(user, 201, res);
  })
);

router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return next(new ErrorHandler("Email and password are required", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    return sendToken(user, 200, res);
  })
);

module.exports = router;
