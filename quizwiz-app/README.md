# QuizWiz - Professional Quiz Application

A modern, professional quiz application built with React and Node.js, featuring user authentication, progress tracking, and multiple quiz modes.

## Features

- **Professional Gen Z Design** - Modern, clean interface with vibrant colors
- **User Authentication** - Complete login system with signup, forgot password, and profile management
- **Two Quiz Modes**:
  - **Practice Mode**: Untimed with instant feedback
  - **Exam Mode**: Timed with results at completion
- **Progress Tracking** - Detailed statistics and performance analytics
- **Subject/Grade/Difficulty Selection** - Customizable quiz parameters
- **User Profiles** - Grade management and personal statistics
- **MongoDB Integration** - Persistent data storage

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone and setup**:
```bash
cd quizwiz-app
npm run install:all
```

2. **Start MongoDB** (if running locally):
```bash
mongod
```

3. **Load sample questions**:
```bash
npm run load-questions
# Or manually:
cd backend && node scripts/loadQuestions.js data/sample-questions.json
```

4. **Start the application**:
```bash
# Terminal 1 - Backend
npm run start:backend

# Terminal 2 - Frontend  
npm run start:frontend
```

5. **Access the app**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Test User

A test user is automatically created when loading questions:
- **Email**: test@quizwiz.com
- **Password**: password123

## Project Structure

```
quizwiz-app/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── styles/          # Styled components
│   │   └── App.js           # Main app component
│   └── public/              # Static files
├── backend/                 # Node.js API
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   ├── scripts/             # Utility scripts
│   └── data/                # Sample data
└── package.json             # Root package file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset

### User Management
- `GET /api/user/stats` - User statistics
- `GET /api/user/recent-quizzes` - Recent quiz history
- `GET /api/user/subject-stats` - Performance by subject
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/change-password` - Change password

### Quiz System
- `GET /api/quiz/subjects` - Available subjects
- `GET /api/quiz/stats` - Dashboard statistics
- `POST /api/quiz/start` - Start a quiz
- `POST /api/quiz/complete` - Complete and score quiz

## Question Format

Questions should be in JSON format with `_id` field containing subject, grade, and difficulty:

```json
{
  "_id": "math_9_medium_1",
  "question": "What is 2 + 2?",
  "options": ["3", "4", "5", "6"],
  "correctAnswer": "4",
  "explanation": "Basic addition: 2 + 2 = 4"
}
```

### ID Format
- Format: `{subject}_{grade}_{difficulty}_{number}`
- Subject: math, science, english, history, etc.
- Grade: 6, 7, 8, 9, 10, 11, 12
- Difficulty: easy, medium, hard

## Loading Questions

Use the provided script to load questions from JSON:

```bash
cd backend
node scripts/loadQuestions.js path/to/your/questions.json
```

The script will:
- Parse question IDs to extract metadata
- Validate question format
- Clear existing questions
- Load new questions
- Create test user

## Environment Variables

Create `.env` file in backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/quizwiz
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

## Design System

### Colors
- Primary: #6366f1 (Indigo)
- Secondary: #ec4899 (Pink)
- Accent: #06b6d4 (Cyan)
- Success: #10b981 (Emerald)
- Warning: #f59e0b (Amber)
- Error: #ef4444 (Red)

### Typography
- Font: Inter (Google Fonts)
- Professional, clean, and modern

## Development

### Frontend Development
```bash
cd frontend
npm start
```

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Adding New Questions
1. Create JSON file with proper format
2. Run: `node scripts/loadQuestions.js your-file.json`
3. Questions will be automatically categorized

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Environment Setup
- Set production MongoDB URI
- Use strong JWT secret
- Configure CORS for production domain

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - see LICENSE file for details.

---

**Ready to test your knowledge?** 🧠✨
