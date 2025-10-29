const express = require('express');
const Question = require('../models/Question');
const QuizResult = require('../models/QuizResult');
const auth = require('../middleware/auth');

const router = express.Router();

// Get available subjects
router.get('/subjects', auth, async (req, res) => {
  try {
    const subjects = await Question.distinct('subject');
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz stats for dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const results = await QuizResult.find({ user: userId });
    
    if (results.length === 0) {
      return res.json({
        totalQuizzes: 0,
        averageScore: 0,
        completedQuizzes: 0,
        bestSubject: 'N/A'
      });
    }

    const totalQuizzes = results.length;
    const averageScore = Math.round(results.reduce((sum, result) => sum + result.score, 0) / totalQuizzes);
    const completedQuizzes = results.length;

    // Find best subject
    const subjectStats = {};
    results.forEach(result => {
      if (!subjectStats[result.subject]) {
        subjectStats[result.subject] = { total: 0, count: 0 };
      }
      subjectStats[result.subject].total += result.score;
      subjectStats[result.subject].count += 1;
    });

    let bestSubject = 'N/A';
    let bestAverage = 0;
    
    Object.keys(subjectStats).forEach(subject => {
      const average = subjectStats[subject].total / subjectStats[subject].count;
      if (average > bestAverage) {
        bestAverage = average;
        bestSubject = subject;
      }
    });

    res.json({
      totalQuizzes,
      averageScore,
      completedQuizzes,
      bestSubject
    });
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start a quiz
router.post('/start', auth, async (req, res) => {
  try {
    const { subject, grade, difficulty, mode, answeredQuestionIds = [] } = req.body;

    if (!subject || !grade || !difficulty) {
      return res.status(400).json({ message: 'Subject, grade, and difficulty are required' });
    }

    // Get questions for the quiz, excluding already answered ones
    const questions = await Question.find({
      subject,
      grade,
      difficulty,
      _id: { $nin: answeredQuestionIds } // Exclude answered questions
    }).limit(10);

    // If we don't have enough unanswered questions, include answered ones
    if (questions.length < 10) {
      const additionalQuestions = await Question.find({
        subject,
        grade,
        difficulty,
        _id: { $in: answeredQuestionIds }
      }).limit(10 - questions.length);
      
      questions.push(...additionalQuestions);
    }

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for the selected criteria' });
    }

    // Shuffle questions and include correct answers for practice mode
    const shuffledQuestions = questions
      .sort(() => Math.random() - 0.5)
      .map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options.sort(() => Math.random() - 0.5),
        correctAnswer: mode === 'practice' ? q.correctAnswer : undefined,
        explanation: mode === 'practice' ? q.explanation : undefined,
        passage: q.passage || null // Include reading passage if exists
      }));

    res.json({
      questions: shuffledQuestions,
      timeLimit: 600 // 10 minutes for exam mode
    });
  } catch (error) {
    console.error('Start quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete a quiz
router.post('/complete', auth, async (req, res) => {
  try {
    const { answers, mode, config, timeSpent, questionIds } = req.body;
    const userId = req.user._id;

    console.log('Quiz completion request:', { answers, questionIds, config });

    if (!answers || !mode || !config) {
      return res.status(400).json({ message: 'Missing required data' });
    }

    // If no questionIds provided, fall back to old method
    if (!questionIds) {
      console.log('No questionIds provided, using fallback method');
      const questions = await Question.find({
        subject: config.subject,
        grade: config.grade,
        difficulty: config.difficulty
      }).limit(10);

      // Calculate score with first 10 questions
      let correctAnswers = 0;
      const questionResults = [];

      questions.forEach((question, index) => {
        const userAnswer = answers[index] || '';
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) correctAnswers++;

        questionResults.push({
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          passage: question.passage || null,
          userAnswer,
          isCorrect
        });
      });

      const totalQuestions = questions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      return res.json({
        score,
        totalQuestions,
        correctAnswers,
        timeSpent,
        mode,
        questions: questionResults,
        userAnswers: Object.values(answers)
      });
    }

    // Get the specific questions that were in the quiz
    const questions = await Question.find({
      _id: { $in: questionIds }
    });

    if (questions.length === 0) {
      return res.status(404).json({ message: 'Questions not found' });
    }

    // Create a map for quick lookup
    const questionMap = {};
    questions.forEach(q => {
      questionMap[q._id.toString()] = q;
    });

    // Calculate score
    let correctAnswers = 0;
    const questionResults = [];

    questionIds.forEach((questionId, index) => {
      const question = questionMap[questionId];
      const userAnswer = answers[index] || '';
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;

      questionResults.push({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        passage: question.passage || null,
        userAnswer,
        isCorrect
      });
    });

    const totalQuestions = questionIds.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Save quiz result
    const quizResult = new QuizResult({
      user: userId,
      subject: config.subject,
      grade: config.grade,
      difficulty: config.difficulty,
      mode,
      questions: questionResults,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent
    });

    await quizResult.save();

    // Return results
    res.json({
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      mode,
      questions: questionResults,
      userAnswers: Object.values(answers)
    });
  } catch (error) {
    console.error('Complete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
