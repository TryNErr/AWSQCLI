const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const results = await QuizResult.find({ user: userId });
    
    if (results.length === 0) {
      return res.json({
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0
      });
    }

    const totalQuizzes = results.length;
    const averageScore = Math.round(results.reduce((sum, result) => sum + result.score, 0) / totalQuizzes);
    const bestScore = Math.max(...results.map(result => result.score));
    const totalTimeSpent = Math.round(results.reduce((sum, result) => sum + (result.timeSpent || 0), 0) / 60);

    res.json({
      totalQuizzes,
      averageScore,
      bestScore,
      totalTimeSpent
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent quizzes
router.get('/recent-quizzes', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const recentQuizzes = await QuizResult.find({ user: userId })
      .sort({ completedAt: -1 })
      .limit(10)
      .select('subject grade difficulty mode score completedAt');

    res.json(recentQuizzes);
  } catch (error) {
    console.error('Get recent quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subject stats
router.get('/subject-stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const subjectStats = await QuizResult.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$subject',
          averageScore: { $avg: '$score' },
          totalQuizzes: { $sum: 1 }
        }
      },
      {
        $project: {
          subject: '$_id',
          averageScore: { $round: ['$averageScore', 0] },
          totalQuizzes: 1,
          _id: 0
        }
      },
      { $sort: { averageScore: -1 } }
    ]);

    res.json(subjectStats);
  } catch (error) {
    console.error('Get subject stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', auth, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('grade').isIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']).withMessage('Invalid grade')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, grade } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, grade },
      { new: true }
    ).select('-password');

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      grade: updatedUser.grade,
      createdAt: updatedUser.createdAt
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', auth, [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
