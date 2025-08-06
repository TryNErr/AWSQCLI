import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import TestSession from '../models/TestSession';
import Question from '../models/Question';
import User from '../models/User';

const router = express.Router();

// Get user's overall analytics
router.get('/overview', asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user._id;
  
  // Get user's completed sessions
  const sessions = await TestSession.find({
    userId,
    completed: true
  }).populate('questions', 'subject topic difficulty');

  if (sessions.length === 0) {
    return res.json({
      success: true,
      data: {
        totalSessions: 0,
        totalQuestions: 0,
        overallAccuracy: 0,
        averageScore: 0,
        totalStudyTime: 0,
        streakData: req.user.streaks,
        performanceBySubject: {},
        performanceByDifficulty: {},
        progressOverTime: []
      }
    });
  }

  // Calculate overall statistics
  const totalSessions = sessions.length;
  const totalQuestions = sessions.reduce((sum, session) => sum + session.answers.length, 0);
  const totalCorrect = sessions.reduce((sum, session) => 
    sum + session.answers.filter(a => a.isCorrect).length, 0);
  const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  const averageScore = sessions.reduce((sum, session) => sum + (session.score || 0), 0) / totalSessions;
  const totalStudyTime = sessions.reduce((sum, session) => 
    sum + session.answers.reduce((timeSum, answer) => timeSum + answer.timeSpent, 0), 0);

  // Performance by subject
  const performanceBySubject: { [key: string]: { correct: number; total: number; accuracy: number } } = {};
  
  // Performance by difficulty
  const performanceByDifficulty: { [key: string]: { correct: number; total: number; accuracy: number } } = {};

  // Process each session
  for (const session of sessions) {
    for (const answer of session.answers) {
      const question = session.questions.find((q: any) => q._id.toString() === answer.questionId.toString()) as any;
      if (question) {
        // By subject
        if (!performanceBySubject[question.subject]) {
          performanceBySubject[question.subject] = { correct: 0, total: 0, accuracy: 0 };
        }
        performanceBySubject[question.subject].total++;
        if (answer.isCorrect) performanceBySubject[question.subject].correct++;

        // By difficulty
        if (!performanceByDifficulty[question.difficulty]) {
          performanceByDifficulty[question.difficulty] = { correct: 0, total: 0, accuracy: 0 };
        }
        performanceByDifficulty[question.difficulty].total++;
        if (answer.isCorrect) performanceByDifficulty[question.difficulty].correct++;
      }
    }
  }

  // Calculate accuracy percentages
  Object.keys(performanceBySubject).forEach(subject => {
    const perf = performanceBySubject[subject];
    perf.accuracy = (perf.correct / perf.total) * 100;
  });

  Object.keys(performanceByDifficulty).forEach(difficulty => {
    const perf = performanceByDifficulty[difficulty];
    perf.accuracy = (perf.correct / perf.total) * 100;
  });

  // Progress over time (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentSessions = sessions.filter(session => (session as any).createdAt >= thirtyDaysAgo);
  const progressOverTime = recentSessions.map(session => ({
    date: (session as any).createdAt,
    score: session.score || 0,
    accuracy: session.getAccuracy(),
    questionsAnswered: session.answers.length
  }));

  res.json({
    success: true,
    data: {
      totalSessions,
      totalQuestions,
      overallAccuracy: Math.round(overallAccuracy * 100) / 100,
      averageScore: Math.round(averageScore * 100) / 100,
      totalStudyTime: Math.round(totalStudyTime / 60), // Convert to minutes
      streakData: req.user.streaks,
      performanceBySubject,
      performanceByDifficulty,
      progressOverTime
    }
  });
}));

// Get performance by topic
router.get('/topics', asyncHandler(async (req: AuthRequest, res) => {
  const { subject } = req.query;
  const userId = req.user._id;

  const query: any = { userId, completed: true };
  
  const sessions = await TestSession.find(query).populate('questions', 'subject topic difficulty');

  const performanceByTopic: { [key: string]: { 
    correct: number; 
    total: number; 
    accuracy: number;
    averageTime: number;
    lastAttempt: Date;
  } } = {};

  for (const session of sessions) {
    for (const answer of session.answers) {
      const question = session.questions.find((q: any) => q._id.toString() === answer.questionId.toString()) as any;
      if (question && (!subject || question.subject === subject)) {
        if (!performanceByTopic[question.topic]) {
          performanceByTopic[question.topic] = {
            correct: 0,
            total: 0,
            accuracy: 0,
            averageTime: 0,
            lastAttempt: (session as any).createdAt
          };
        }
        
        performanceByTopic[question.topic].total++;
        if (answer.isCorrect) performanceByTopic[question.topic].correct++;
        performanceByTopic[question.topic].averageTime += answer.timeSpent;
        
        if ((session as any).createdAt > performanceByTopic[question.topic].lastAttempt) {
          performanceByTopic[question.topic].lastAttempt = (session as any).createdAt;
        }
      }
    }
  }

  // Calculate final metrics
  Object.keys(performanceByTopic).forEach(topic => {
    const perf = performanceByTopic[topic];
    perf.accuracy = (perf.correct / perf.total) * 100;
    perf.averageTime = perf.averageTime / perf.total;
  });

  res.json({
    success: true,
    data: performanceByTopic
  });
}));

// Get learning recommendations
router.get('/recommendations', asyncHandler(async (req: AuthRequest, res) => {
  const user = req.user;
  const weakAreas = user.stats.weakAreas || [];
  const strongAreas = user.stats.strongAreas || [];

  // Get recent performance trends
  const recentSessions = await TestSession.find({
    userId: user._id,
    completed: true,
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
  }).populate('questions', 'subject topic difficulty');

  const recommendations = [];

  // Recommend focusing on weak areas
  if (weakAreas.length > 0) {
    recommendations.push({
      type: 'focus_weak_areas',
      title: 'Focus on Weak Areas',
      description: `You should practice more in: ${weakAreas.join(', ')}`,
      priority: 'high',
      action: 'practice',
      topics: weakAreas
    });
  }

  // Recommend increasing difficulty if doing well
  if (user.stats.accuracy > 80 && strongAreas.length > 0) {
    recommendations.push({
      type: 'increase_difficulty',
      title: 'Challenge Yourself',
      description: 'You\'re doing great! Try harder questions to improve further.',
      priority: 'medium',
      action: 'practice_hard',
      topics: strongAreas
    });
  }

  // Recommend daily practice if streak is low
  if (user.streaks.current < 3) {
    recommendations.push({
      type: 'daily_practice',
      title: 'Build a Study Streak',
      description: 'Try to practice daily to build momentum and improve retention.',
      priority: 'medium',
      action: 'daily_challenge'
    });
  }

  // Recommend specific subjects based on recent performance
  if (recentSessions.length > 0) {
    const subjectPerformance: { [key: string]: { correct: number; total: number } } = {};
    
    for (const session of recentSessions) {
      for (const answer of session.answers) {
        const question = session.questions.find((q: any) => q._id.toString() === answer.questionId.toString()) as any;
        if (question) {
          if (!subjectPerformance[question.subject]) {
            subjectPerformance[question.subject] = { correct: 0, total: 0 };
          }
          subjectPerformance[question.subject].total++;
          if (answer.isCorrect) subjectPerformance[question.subject].correct++;
        }
      }
    }

    const strugglingSubjects = Object.entries(subjectPerformance)
      .filter(([_, perf]) => perf.total >= 3 && (perf.correct / perf.total) < 0.6)
      .map(([subject, _]) => subject);

    if (strugglingSubjects.length > 0) {
      recommendations.push({
        type: 'subject_focus',
        title: 'Subject-Specific Practice',
        description: `Recent performance suggests focusing on: ${strugglingSubjects.join(', ')}`,
        priority: 'high',
        action: 'practice',
        subjects: strugglingSubjects
      });
    }
  }

  res.json({
    success: true,
    data: recommendations
  });
}));

// Get study time analytics
router.get('/study-time', asyncHandler(async (req: AuthRequest, res) => {
  const { period = '30' } = req.query; // days
  const userId = req.user._id;
  
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(period as string));

  const sessions = await TestSession.find({
    userId,
    completed: true,
    createdAt: { $gte: daysAgo }
  });

  // Group by date
  const studyTimeByDate: { [key: string]: number } = {};
  
  sessions.forEach(session => {
    const date = (session as any).createdAt.toISOString().split('T')[0];
    const sessionTime = session.answers.reduce((sum, answer) => sum + answer.timeSpent, 0);
    
    if (!studyTimeByDate[date]) {
      studyTimeByDate[date] = 0;
    }
    studyTimeByDate[date] += sessionTime;
  });

  // Convert to array and sort by date
  const studyTimeData = Object.entries(studyTimeByDate)
    .map(([date, time]) => ({
      date,
      studyTime: Math.round(time / 60) // Convert to minutes
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalStudyTime = Object.values(studyTimeByDate).reduce((sum, time) => sum + time, 0);
  const averageDailyTime = studyTimeData.length > 0 ? totalStudyTime / studyTimeData.length : 0;

  res.json({
    success: true,
    data: {
      studyTimeByDate: studyTimeData,
      totalStudyTime: Math.round(totalStudyTime / 60), // minutes
      averageDailyTime: Math.round(averageDailyTime / 60), // minutes
      activeDays: studyTimeData.length,
      period: parseInt(period as string)
    }
  });
}));

// Get comparison with peers (anonymized)
router.get('/peer-comparison', asyncHandler(async (req: AuthRequest, res) => {
  const user = req.user;
  
  // Get all users' stats for comparison (anonymized)
  const allUsers = await User.find({}, 'stats streaks').lean();
  
  if (allUsers.length < 2) {
    return res.json({
      success: true,
      data: {
        message: 'Not enough users for comparison',
        userRank: 1,
        totalUsers: allUsers.length
      }
    });
  }

  // Calculate percentiles
  const accuracies = allUsers.map(u => u.stats.accuracy).sort((a, b) => b - a);
  const streaks = allUsers.map(u => u.streaks.current).sort((a, b) => b - a);
  const totalQuestions = allUsers.map(u => u.stats.totalQuestions).sort((a, b) => b - a);

  const userAccuracyRank = accuracies.indexOf(user.stats.accuracy) + 1;
  const userStreakRank = streaks.indexOf(user.streaks.current) + 1;
  const userQuestionsRank = totalQuestions.indexOf(user.stats.totalQuestions) + 1;

  const getPercentile = (rank: number, total: number) => Math.round(((total - rank) / total) * 100);

  res.json({
    success: true,
    data: {
      accuracy: {
        userValue: user.stats.accuracy,
        rank: userAccuracyRank,
        percentile: getPercentile(userAccuracyRank, allUsers.length),
        average: accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length
      },
      streak: {
        userValue: user.streaks.current,
        rank: userStreakRank,
        percentile: getPercentile(userStreakRank, allUsers.length),
        average: streaks.reduce((sum, streak) => sum + streak, 0) / streaks.length
      },
      totalQuestions: {
        userValue: user.stats.totalQuestions,
        rank: userQuestionsRank,
        percentile: getPercentile(userQuestionsRank, allUsers.length),
        average: totalQuestions.reduce((sum, total) => sum + total, 0) / totalQuestions.length
      },
      totalUsers: allUsers.length
    }
  });
}));

export default router;
