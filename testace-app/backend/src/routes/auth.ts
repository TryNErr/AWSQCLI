import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validate, registerSchema, loginSchema } from '../middleware/validation';
import { generateToken } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Register
router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { username, email, password, profile } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email or username already exists'
    });
  }

  // Create new user
  const user = new User({
    username,
    email,
    password,
    profile
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id.toString());

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  });
}));

// Login
router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update streak
  user.updateStreak();
  await user.save();

  // Generate token
  const token = generateToken(user._id.toString());

  // Remove password from response
  const userResponse = user.toJSON();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse,
      token
    }
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token required'
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const newToken = generateToken(user._id.toString());

    res.json({
      success: true,
      data: {
        token: newToken,
        user
      }
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
}));

// Forgot password (placeholder for future implementation)
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // TODO: Implement email sending logic
  // For now, just return success
  res.json({
    success: true,
    message: 'Password reset instructions sent to your email'
  });
}));

// Verify email (placeholder for future implementation)
router.post('/verify-email', asyncHandler(async (req, res) => {
  const { token } = req.body;

  // TODO: Implement email verification logic
  res.json({
    success: true,
    message: 'Email verified successfully'
  });
}));

export default router;
