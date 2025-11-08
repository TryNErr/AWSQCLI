const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/test', (req, res) => {
  res.json({ 
    message: 'QuizWiz API is running!',
    timestamp: new Date().toISOString()
  });
});

// API endpoints
app.get('/api/quiz/stats', (req, res) => {
  res.json({ 
    totalQuizzes: 0, 
    averageScore: 0,
    message: 'Stats endpoint working!'
  });
});

app.get('/api/test-sets/available', (req, res) => {
  const query = req.query;
  console.log('Test sets query:', query);
  
  res.json({
    testSets: [],
    message: 'No test sets available yet - backend is working!',
    query: query
  });
});

app.get('/api/user/stats', (req, res) => {
  res.json({ 
    quizzesTaken: 0, 
    totalScore: 0,
    message: 'User stats endpoint working!'
  });
});

// Catch all for debugging
app.use('*', (req, res) => {
  res.json({ 
    message: 'QuizWiz API endpoint received request',
    path: req.originalUrl,
    method: req.method,
    query: req.query,
    headers: req.headers
  });
});

app.listen(port, () => {
  console.log(`QuizWiz API server running on port ${port}`);
});

module.exports = app;
