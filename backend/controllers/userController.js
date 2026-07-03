import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRE_TIME = "24h";

function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRE_TIME });
}

// Register user
export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please fill all the fields",
      success: false,
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      message: "Please enter a valid email",
      success: false,
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
      success: false,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}

// Login user
export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please fill all the fields",
      success: false,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
        success: false,
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = createToken(user._id);

    return res.json({
      message: "User logged in successfully",
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}

// Get current user
export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select("name email");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}

// Update user profile
export async function updateProfile(req, res) {
  const { name, email } = req.body;

  if (!name || !email || !validator.isEmail(email)) {
    return res.status(400).json({
      message: "Please provide a valid name and email",
      success: false,
    });
  }

  try {
    const exists = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });

    if (exists) {
      return res.status(409).json({
        message: "Email already in use",
        success: false,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      {
        new: true,
        runValidators: true,
      }
    ).select("name email");

    return res.json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}

// Change password
export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({
      message: "Please provide current and new password (at least 8 characters)",
      success: false,
    });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Current password is incorrect",
        success: false,
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}