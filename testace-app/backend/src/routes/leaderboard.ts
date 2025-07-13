import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import TestSession from '../models/TestSession';
import { TestMode } from '../../../shared/types';

const router = express.Router();

// Get global leaderboard
router.get('/global', asyncHandler(async (req: AuthRequest, res) => {
  const { 
    period = 'all', // all, week, month
    metric = 'accuracy', // accuracy, streak, questions
    limit = 50 
  } = req.query;

  let dateFilter = {};
  
  if (period === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    dateFilter = { 'streaks.lastActivity': { $gte: weekAgo } };
  } else if (period === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    dateFilter = { 'streaks.lastActivity': { $gte: monthAgo } };
  }

  // Build sort criteria based on metric
  let sortCriteria: any = {};
  switch (metric) {
    case 'accuracy':
      sortCriteria = { 'stats.accuracy': -1, 'stats.totalQuestions': -1 };
      break;
    case 'streak':
      sortCriteria = { 'streaks.current': -1, 'stats.accuracy': -1 };
      break;
    case 'questions':
      sortCriteria = { 'stats.totalQuestions': -1, 'stats.accuracy': -1 };
      break;
    default:
      sortCriteria = { 'stats.accuracy': -1 };
  }

  const users = await User.find({
    'stats.totalQuestions': { $gte: 10 }, // Minimum questions to appear on leaderboard
    ...dateFilter
  })
  .select('username profile.firstName profile.lastName profile.avatar stats streaks')
  .sort(sortCriteria)
  .limit(parseInt(limit as string));

  // Add rank to each user
  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    userId: user._id,
    username: user.username,
    displayName: `${user.profile.firstName} ${user.profile.lastName}`,
    avatar: user.profile.avatar,
    stats: user.stats,
    streak: user.streaks.current,
    score: getScoreByMetric(user, metric as string)
  }));

  // Find current user's position
  const currentUserRank = leaderboard.findIndex(entry => 
    entry.userId.toString() === req.user._id.toString()
  ) + 1;

  res.json({
    success: true,
    data: {
      leaderboard,
      currentUserRank: currentUserRank || null,
      period,
      metric,
      totalUsers: users.length
    }
  });
}));

// Get daily challenge leaderboard
router.get('/daily-challenge', asyncHandler(async (req: AuthRequest, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get today's daily challenge sessions
  const sessions = await TestSession.find({
    mode: TestMode.DAILY_CHALLENGE,
    completed: true,
    createdAt: {
      $gte: today,
      $lt: tomorrow
    }
  })
  .populate('userId', 'username profile.firstName profile.lastName profile.avatar')
  .sort({ score: -1, endTime: 1 }); // Sort by score desc, then by completion time asc

  const leaderboard = sessions.map((session, index) => ({
    rank: index + 1,
    userId: session.userId._id,
    username: (session.userId as any).username,
    displayName: `${(session.userId as any).profile.firstName} ${(session.userId as any).profile.lastName}`,
    avatar: (session.userId as any).profile.avatar,
    score: session.score,
    accuracy: session.getAccuracy(),
    completionTime: session.endTime,
    timeTaken: session.endTime ? 
      Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000) : 0
  }));

  // Find current user's position
  const currentUserRank = leaderboard.findIndex(entry => 
    entry.userId.toString() === req.user._id.toString()
  ) + 1;

  res.json({
    success: true,
    data: {
      leaderboard,
      currentUserRank: currentUserRank || null,
      date: today.toISOString().split('T')[0],
      totalParticipants: sessions.length
    }
  });
}));

// Get subject-specific leaderboard
router.get('/subject/:subject', asyncHandler(async (req: AuthRequest, res) => {
  const { subject } = req.params;
  const { limit = 50 } = req.query;

  // Get sessions for the specific subject
  const sessions = await TestSession.aggregate([
    {
      $match: {
        subject: subject,
        completed: true
      }
    },
    {
      $group: {
        _id: '$userId',
        totalSessions: { $sum: 1 },
        averageScore: { $avg: '$score' },
        totalQuestions: { $sum: { $size: '$answers' } },
        totalCorrect: {
          $sum: {
            $size: {
              $filter: {
                input: '$answers',
                cond: { $eq: ['$$this.isCorrect', true] }
              }
            }
          }
        },
        lastActivity: { $max: '$createdAt' }
      }
    },
    {
      $addFields: {
        accuracy: {
          $multiply: [
            { $divide: ['$totalCorrect', '$totalQuestions'] },
            100
          ]
        }
      }
    },
    {
      $match: {
        totalQuestions: { $gte: 5 } // Minimum questions in subject
      }
    },
    {
      $sort: { accuracy: -1, averageScore: -1 }
    },
    {
      $limit: parseInt(limit as string)
    }
  ]);

  // Populate user information
  const userIds = sessions.map(session => session._id);
  const users = await User.find({ _id: { $in: userIds } })
    .select('username profile.firstName profile.lastName profile.avatar');

  const userMap = users.reduce((map, user) => {
    map[user._id.toString()] = user;
    return map;
  }, {} as any);

  const leaderboard = sessions.map((session, index) => {
    const user = userMap[session._id.toString()];
    return {
      rank: index + 1,
      userId: session._id,
      username: user?.username,
      displayName: user ? `${user.profile.firstName} ${user.profile.lastName}` : 'Unknown',
      avatar: user?.profile.avatar,
      accuracy: Math.round(session.accuracy * 100) / 100,
      averageScore: Math.round(session.averageScore * 100) / 100,
      totalQuestions: session.totalQuestions,
      totalSessions: session.totalSessions,
      lastActivity: session.lastActivity
    };
  });

  // Find current user's position
  const currentUserRank = leaderboard.findIndex(entry => 
    entry.userId.toString() === req.user._id.toString()
  ) + 1;

  res.json({
    success: true,
    data: {
      leaderboard,
      currentUserRank: currentUserRank || null,
      subject,
      totalUsers: sessions.length
    }
  });
}));

// Get friends leaderboard (placeholder for future implementation)
router.get('/friends', asyncHandler(async (req: AuthRequest, res) => {
  // TODO: Implement friends system
  // For now, return empty leaderboard
  res.json({
    success: true,
    data: {
      leaderboard: [],
      currentUserRank: null,
      message: 'Friends system not yet implemented'
    }
  });
}));

// Get leaderboard history for a user
router.get('/history/:userId?', asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.params.userId || req.user._id;
  const { days = 30 } = req.query;

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

  // Get user's rank history (simplified - in production, you'd store daily snapshots)
  const sessions = await TestSession.find({
    userId,
    completed: true,
    createdAt: { $gte: daysAgo }
  }).sort({ createdAt: 1 });

  // Calculate running statistics
  let totalQuestions = 0;
  let totalCorrect = 0;
  let currentStreak = 0;
  
  const history = sessions.map(session => {
    totalQuestions += session.answers.length;
    totalCorrect += session.answers.filter(a => a.isCorrect).length;
    
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    
    return {
      date: session.createdAt.toISOString().split('T')[0],
      accuracy: Math.round(accuracy * 100) / 100,
      totalQuestions,
      score: session.score,
      sessionType: session.mode
    };
  });

  res.json({
    success: true,
    data: {
      history,
      period: parseInt(days as string),
      userId
    }
  });
}));

// Helper function to get score based on metric
function getScoreByMetric(user: any, metric: string): number {
  switch (metric) {
    case 'accuracy':
      return Math.round(user.stats.accuracy * 100) / 100;
    case 'streak':
      return user.streaks.current;
    case 'questions':
      return user.stats.totalQuestions;
    default:
      return user.stats.accuracy;
  }
}

export default router;
