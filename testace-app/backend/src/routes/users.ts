import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import TestSession from '../models/TestSession';
import { getStudyRecommendations } from '../services/openaiService';

const router = express.Router();

// Get current user profile
router.get('/profile', asyncHandler(async (req: AuthRequest, res) => {
  const user = req.user;
  
  res.json({
    success: true,
    data: user
  });
}));

// Update user profile
router.put('/profile', asyncHandler(async (req: AuthRequest, res) => {
  const { profile } = req.body;
  const userId = req.user._id;

  const allowedUpdates = ['firstName', 'lastName', 'avatar', 'grade', 'subjects', 'targetTests'];
  const updates: any = {};

  // Filter allowed updates
  Object.keys(profile || {}).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[`profile.${key}`] = profile[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid updates provided'
    });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
}));

// Get user dashboard data
router.get('/dashboard', asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user._id;
  const user = req.user;

  // Get recent sessions
  const recentSessions = await TestSession.find({
    userId,
    completed: true
  })
  .sort({ createdAt: -1 })
  .limit(5)
  .populate('questions', 'subject topic difficulty');

  // Get today's daily challenge status
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysDailyChallenge = await TestSession.findOne({
    userId,
    mode: 'daily_challenge',
    createdAt: {
      $gte: today,
      $lt: tomorrow
    }
  });

  // Calculate this week's progress
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekSessions = await TestSession.find({
    userId,
    completed: true,
    createdAt: { $gte: weekAgo }
  });

  const weekStats = {
    sessionsCompleted: weekSessions.length,
    questionsAnswered: weekSessions.reduce((sum, session) => sum + session.answers.length, 0),
    averageAccuracy: weekSessions.length > 0 
      ? weekSessions.reduce((sum, session) => sum + session.getAccuracy(), 0) / weekSessions.length 
      : 0,
    studyTime: weekSessions.reduce((sum, session) => 
      sum + session.answers.reduce((timeSum, answer) => timeSum + answer.timeSpent, 0), 0)
  };

  // Get AI-powered study recommendations
  let studyRecommendations: string[] = [];
  try {
    const recentPerformance = recentSessions.map(session => ({
      subject: session.subject || 'General',
      accuracy: session.getAccuracy()
    }));

    studyRecommendations = await getStudyRecommendations(
      user.stats,
      user.stats.weakAreas || [],
      recentPerformance
    );
  } catch (error) {
    console.error('Error getting study recommendations:', error);
    studyRecommendations = [
      'Continue practicing regularly',
      'Focus on your weak areas',
      'Try timed practice sessions'
    ];
  }

  res.json({
    success: true,
    data: {
      user: {
        username: user.username,
        profile: user.profile,
        stats: user.stats,
        streaks: user.streaks
      },
      recentSessions: recentSessions.map(session => ({
        _id: session._id,
        mode: session.mode,
        score: session.score,
        accuracy: session.getAccuracy(),
        createdAt: session.createdAt,
        subject: session.subject,
        questionsCount: session.answers.length
      })),
      dailyChallengeStatus: {
        completed: !!todaysDailyChallenge,
        score: todaysDailyChallenge?.score || null,
        completedAt: todaysDailyChallenge?.endTime || null
      },
      weekStats: {
        ...weekStats,
        studyTime: Math.round(weekStats.studyTime / 60) // Convert to minutes
      },
      studyRecommendations
    }
  });
}));

// Get user achievements (placeholder for future implementation)
router.get('/achievements', asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user._id;
  const user = req.user;

  // Calculate achievements based on user stats
  const achievements = [];

  // Streak achievements
  if (user.streaks.current >= 7) {
    achievements.push({
      id: 'week_streak',
      title: 'Week Warrior',
      description: 'Maintained a 7-day study streak',
      icon: '🔥',
      unlockedAt: user.streaks.lastActivity
    });
  }

  if (user.streaks.longest >= 30) {
    achievements.push({
      id: 'month_streak',
      title: 'Monthly Master',
      description: 'Achieved a 30-day study streak',
      icon: '🏆',
      unlockedAt: user.streaks.lastActivity
    });
  }

  // Accuracy achievements
  if (user.stats.accuracy >= 90 && user.stats.totalQuestions >= 100) {
    achievements.push({
      id: 'accuracy_master',
      title: 'Accuracy Master',
      description: 'Maintained 90%+ accuracy over 100+ questions',
      icon: '🎯',
      unlockedAt: user.updatedAt
    });
  }

  // Question count achievements
  if (user.stats.totalQuestions >= 1000) {
    achievements.push({
      id: 'thousand_questions',
      title: 'Question Conqueror',
      description: 'Answered 1000+ questions',
      icon: '📚',
      unlockedAt: user.updatedAt
    });
  }

  // Study time achievements
  const studyHours = user.stats.totalStudyTime / 3600;
  if (studyHours >= 50) {
    achievements.push({
      id: 'study_time_50',
      title: 'Dedicated Learner',
      description: 'Spent 50+ hours studying',
      icon: '⏰',
      unlockedAt: user.updatedAt
    });
  }

  res.json({
    success: true,
    data: {
      achievements,
      totalAchievements: achievements.length,
      progress: {
        currentStreak: user.streaks.current,
        longestStreak: user.streaks.longest,
        totalQuestions: user.stats.totalQuestions,
        accuracy: user.stats.accuracy,
        studyHours: Math.round(studyHours * 10) / 10
      }
    }
  });
}));

// Update user preferences
router.put('/preferences', asyncHandler(async (req: AuthRequest, res) => {
  const { preferences } = req.body;
  const userId = req.user._id;

  // For now, store preferences in user profile
  // In a full implementation, you might have a separate preferences schema
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { 'profile.preferences': preferences } },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Preferences updated successfully',
    data: user
  });
}));

// Change password
router.put('/password', asyncHandler(async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long'
    });
  }

  // Get user with password
  const user = await User.findById(userId).select('+password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}));

// Delete user account
router.delete('/account', asyncHandler(async (req: AuthRequest, res) => {
  const { password } = req.body;
  const userId = req.user._id;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password confirmation required'
    });
  }

  // Get user with password
  const user = await User.findById(userId).select('+password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Password is incorrect'
    });
  }

  // Delete user data
  await Promise.all([
    User.findByIdAndDelete(userId),
    TestSession.deleteMany({ userId }),
    // Add other user-related data cleanup here
  ]);

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
}));

// Get user's study calendar
router.get('/calendar', asyncHandler(async (req: AuthRequest, res) => {
  const { year, month } = req.query;
  const userId = req.user._id;

  const currentYear = year ? parseInt(year as string) : new Date().getFullYear();
  const currentMonth = month ? parseInt(month as string) - 1 : new Date().getMonth();

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);

  const sessions = await TestSession.find({
    userId,
    completed: true,
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).select('createdAt score mode answers');

  // Group sessions by date
  const calendar: { [key: string]: any } = {};

  sessions.forEach(session => {
    const date = session.createdAt.toISOString().split('T')[0];
    
    if (!calendar[date]) {
      calendar[date] = {
        date,
        sessions: 0,
        totalQuestions: 0,
        averageScore: 0,
        studyTime: 0,
        modes: []
      };
    }

    calendar[date].sessions++;
    calendar[date].totalQuestions += session.answers.length;
    calendar[date].averageScore += session.score || 0;
    calendar[date].studyTime += session.answers.reduce((sum, answer) => sum + answer.timeSpent, 0);
    calendar[date].modes.push(session.mode);
  });

  // Calculate averages
  Object.keys(calendar).forEach(date => {
    const day = calendar[date];
    day.averageScore = Math.round(day.averageScore / day.sessions);
    day.studyTime = Math.round(day.studyTime / 60); // Convert to minutes
    day.modes = [...new Set(day.modes)]; // Remove duplicates
  });

  res.json({
    success: true,
    data: {
      calendar,
      year: currentYear,
      month: currentMonth + 1,
      totalDaysActive: Object.keys(calendar).length
    }
  });
}));

export default router;
