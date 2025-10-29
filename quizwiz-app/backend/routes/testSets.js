const express = require('express');
const router = express.Router();
const TestSet = require('../models/TestSet');
const UserTestProgress = require('../models/UserTestProgress');
const QuizResult = require('../models/QuizResult');
const DisputedQuestion = require('../models/DisputedQuestion');
const auth = require('../middleware/auth');

// Get available test sets for a subject/grade/difficulty/mode combination
router.get('/available', auth, async (req, res) => {
  try {
    const { subject, grade, difficulty, mode } = req.query;
    
    if (!subject || !grade || !difficulty || !mode) {
      return res.status(400).json({ 
        message: 'Subject, grade, difficulty, and mode are required' 
      });
    }
    
    // Get all test sets for this combination
    const testSets = await TestSet.find({
      subject,
      grade,
      difficulty,
      mode,
      isActive: true
    }).sort({ setNumber: 1 });
    
    // Get user's progress for these test sets
    const userProgress = await UserTestProgress.find({
      user: req.user.id,
      testSet: { $in: testSets.map(ts => ts._id) }
    }).populate('testSet');
    
    // Create a map of progress by test set ID
    const progressMap = {};
    userProgress.forEach(progress => {
      progressMap[progress.testSet._id.toString()] = progress;
    });
    
    // Combine test sets with progress information
    const testSetsWithProgress = testSets.map(testSet => {
      const progress = progressMap[testSet._id.toString()];
      return {
        _id: testSet._id,
        name: testSet.name,
        subject: testSet.subject,
        grade: testSet.grade,
        difficulty: testSet.difficulty,
        mode: testSet.mode,
        setNumber: testSet.setNumber,
        totalQuestions: testSet.totalQuestions,
        status: progress ? progress.status : 'not_started',
        bestScore: progress ? progress.bestScore : 0,
        totalAttempts: progress ? progress.totalAttempts : 0,
        lastAttemptAt: progress ? progress.lastAttemptAt : null
      };
    });
    
    res.json(testSetsWithProgress);
  } catch (error) {
    console.error('Error fetching test sets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific test set with questions
router.get('/:testSetId', auth, async (req, res) => {
  try {
    const testSet = await TestSet.findById(req.params.testSetId)
      .populate('questions');
    
    if (!testSet) {
      return res.status(404).json({ message: 'Test set not found' });
    }
    
    // Get user's progress for this test set
    const progress = await UserTestProgress.findOne({
      user: req.user.id,
      testSet: testSet._id
    });
    
    res.json({
      testSet,
      progress: progress || null
    });
  } catch (error) {
    console.error('Error fetching test set:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start a test set
router.post('/:testSetId/start', auth, async (req, res) => {
  try {
    const testSet = await TestSet.findById(req.params.testSetId)
      .populate('questions');
    
    if (!testSet) {
      return res.status(404).json({ message: 'Test set not found' });
    }
    
    // Find or create user progress
    let progress = await UserTestProgress.findOne({
      user: req.user.id,
      testSet: testSet._id
    });
    
    if (!progress) {
      progress = new UserTestProgress({
        user: req.user.id,
        testSet: testSet._id,
        status: 'in_progress',
        attempts: []
      });
    }
    
    // Create new attempt
    const attemptNumber = progress.attempts.length + 1;
    const newAttempt = {
      attemptNumber,
      startedAt: new Date(),
      answers: []
    };
    
    progress.attempts.push(newAttempt);
    progress.status = 'in_progress';
    progress.totalAttempts = attemptNumber;
    
    await progress.save();
    
    // Return questions without correct answers for exam mode
    const questions = testSet.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      passage: q.passage,
      // Don't include correctAnswer and explanation during the test
    }));
    
    res.json({
      testSet: {
        _id: testSet._id,
        name: testSet.name,
        subject: testSet.subject,
        grade: testSet.grade,
        difficulty: testSet.difficulty,
        mode: testSet.mode,
        setNumber: testSet.setNumber,
        totalQuestions: testSet.totalQuestions
      },
      questions,
      attemptNumber,
      startedAt: newAttempt.startedAt
    });
  } catch (error) {
    console.error('Error starting test set:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit test set answers
router.post('/:testSetId/submit', auth, async (req, res) => {
  try {
    const { answers, timeSpent, startedAt } = req.body;
    
    const testSet = await TestSet.findById(req.params.testSetId)
      .populate('questions');
    
    if (!testSet) {
      return res.status(404).json({ message: 'Test set not found' });
    }
    
    // Find user progress
    const progress = await UserTestProgress.findOne({
      user: req.user.id,
      testSet: testSet._id
    });
    
    if (!progress) {
      return res.status(400).json({ message: 'Test not started' });
    }
    
    // Get the current attempt
    const currentAttempt = progress.attempts[progress.attempts.length - 1];
    
    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = [];
    
    testSet.questions.forEach((question, index) => {
      const userAnswer = answers[question._id.toString()];
      
      // More flexible answer comparison
      let isCorrect = false;
      if (userAnswer && question.correctAnswer) {
        // Direct match
        if (userAnswer === question.correctAnswer) {
          isCorrect = true;
        } else {
          // Check if user answer contains the correct answer or vice versa
          const userLower = userAnswer.toLowerCase().trim();
          const correctLower = question.correctAnswer.toLowerCase().trim();
          
          // Extract numbers from both answers for numeric comparison
          const userNumbers = userAnswer.match(/\d+/g);
          const correctNumbers = question.correctAnswer.match(/\d+/g);
          
          if (userNumbers && correctNumbers && userNumbers[0] === correctNumbers[0]) {
            // Same number, check if they're both referring to the same thing
            if ((userLower.includes('cent') && correctLower.includes('cent')) ||
                (userLower.includes('c') && correctLower.includes('c')) ||
                (userNumbers[0] === correctNumbers[0] && userNumbers.length === 1 && correctNumbers.length === 1)) {
              isCorrect = true;
            }
          }
        }
      }
      
      if (isCorrect) correctAnswers++;
      
      processedAnswers.push({
        questionId: question._id,
        userAnswer: userAnswer || '',
        isCorrect,
        timeSpent: 0 // Could be tracked per question in future
      });
    });
    
    const score = Math.round((correctAnswers / testSet.totalQuestions) * 100);
    
    // Update attempt
    currentAttempt.completedAt = new Date();
    currentAttempt.score = score;
    currentAttempt.correctAnswers = correctAnswers;
    currentAttempt.totalQuestions = testSet.totalQuestions;
    currentAttempt.timeSpent = timeSpent;
    currentAttempt.answers = processedAnswers;
    
    // Update progress
    progress.status = 'completed';
    progress.bestScore = Math.max(progress.bestScore, score);
    progress.lastAttemptAt = new Date();
    
    await progress.save();
    
    // Create quiz result record
    const quizResult = new QuizResult({
      user: req.user.id,
      testSet: testSet._id,
      subject: testSet.subject,
      grade: testSet.grade,
      difficulty: testSet.difficulty,
      mode: testSet.mode,
      setNumber: testSet.setNumber,
      attemptNumber: currentAttempt.attemptNumber,
      questions: testSet.questions.map((question, index) => {
        const userAnswer = answers[question._id.toString()] || '';
        
        // Use same flexible comparison logic
        let isCorrect = false;
        if (userAnswer && question.correctAnswer) {
          if (userAnswer === question.correctAnswer) {
            isCorrect = true;
          } else {
            const userLower = userAnswer.toLowerCase().trim();
            const correctLower = question.correctAnswer.toLowerCase().trim();
            
            const userNumbers = userAnswer.match(/\d+/g);
            const correctNumbers = question.correctAnswer.match(/\d+/g);
            
            if (userNumbers && correctNumbers && userNumbers[0] === correctNumbers[0]) {
              if ((userLower.includes('cent') && correctLower.includes('cent')) ||
                  (userLower.includes('c') && correctLower.includes('c')) ||
                  (userNumbers[0] === correctNumbers[0] && userNumbers.length === 1 && correctNumbers.length === 1)) {
                isCorrect = true;
              }
            }
          }
        }
        
        return {
          questionId: question._id,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          userAnswer,
          isCorrect,
          timeSpent: 0
        };
      }),
      score,
      percentage: score,
      totalQuestions: testSet.totalQuestions,
      correctAnswers,
      timeSpent,
      startedAt: new Date(startedAt),
      completedAt: new Date()
    });
    
    await quizResult.save();
    
    res.json({
      score,
      correctAnswers,
      totalQuestions: testSet.totalQuestions,
      percentage: score,
      timeSpent,
      attemptNumber: currentAttempt.attemptNumber,
      results: quizResult.questions,
      testSet: {
        _id: testSet._id,
        name: testSet.name,
        subject: testSet.subject,
        grade: testSet.grade,
        difficulty: testSet.difficulty,
        mode: testSet.mode,
        setNumber: testSet.setNumber
      }
    });
  } catch (error) {
    console.error('Error submitting test set:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get test set history for a user
router.get('/history/:subject?', auth, async (req, res) => {
  try {
    const { subject } = req.params;
    const { grade, difficulty, mode } = req.query;
    
    let filter = { user: req.user.id };
    
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (difficulty) filter.difficulty = difficulty;
    if (mode) filter.mode = mode;
    
    const results = await QuizResult.find(filter)
      .populate('testSet', 'name setNumber')
      .sort({ completedAt: -1 })
      .limit(50);
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching test history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed quiz result by ID
router.get('/result/:resultId', auth, async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      _id: req.params.resultId,
      user: req.user.id
    }).populate('testSet', 'name setNumber subject grade difficulty mode');
    
    if (!result) {
      return res.status(404).json({ message: 'Quiz result not found' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dispute a question
router.post('/dispute-question', auth, async (req, res) => {
  try {
    const { questionId, testSetId, question, options, correctAnswer, userAnswer, wasMarkedCorrect, disputeReason } = req.body;
    
    // Check if already disputed by this user
    const existing = await DisputedQuestion.findOne({
      user: req.user.id,
      questionId,
      testSetId
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Question already disputed' });
    }
    
    const disputedQuestion = new DisputedQuestion({
      user: req.user.id,
      questionId,
      testSetId,
      question,
      options,
      correctAnswer,
      userAnswer,
      wasMarkedCorrect,
      disputeReason: disputeReason || ''
    });
    
    await disputedQuestion.save();
    
    res.json({ message: 'Question disputed successfully' });
  } catch (error) {
    console.error('Error disputing question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
