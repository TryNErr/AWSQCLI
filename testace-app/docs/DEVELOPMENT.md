# TestAce Development Guide

## Overview

TestAce is a comprehensive educational web application designed for test preparation with adaptive learning features. It includes real-time practice modes, AI-powered writing critique, analytics, and gamification elements.

## Architecture

### Backend (Node.js + TypeScript)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Real-time**: Socket.io for live features
- **AI Integration**: OpenAI API for writing analysis and adaptive questions
- **File Upload**: Multer for handling file uploads

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Query for server state, Context API for app state
- **Routing**: React Router v6
- **Real-time**: Socket.io client
- **Animations**: Framer Motion
- **Forms**: React Hook Form

## Key Features

### 1. Live Non-Stop Practice Mode
- Auto-refreshing questions with adaptive difficulty
- Real-time feedback and explanations
- Socket.io powered live sessions

### 2. Timed Mode
- Simulates real test environment
- Per-section time limits
- Comprehensive results analysis

### 3. Question Explanation Engine
- Detailed explanations for each answer
- Hints system for guided learning
- Khan Academy-style educational approach

### 4. Smart Analytics
- Tracks performance by subject, topic, and difficulty
- Identifies weak and strong areas
- Progress tracking over time
- AI-powered study recommendations

### 5. Daily Challenge Streak
- Daily challenges to maintain engagement
- Streak tracking and achievements
- Leaderboard integration

### 6. Peer Leaderboard
- Global and subject-specific leaderboards
- Daily challenge rankings
- Anonymous peer comparison

### 7. Writing Critique Upload
- AI-powered writing analysis using OpenAI
- Grammar, structure, clarity, and vocabulary feedback
- Detailed suggestions for improvement

## Database Schema

### User Model
```typescript
{
  username: string;
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    grade?: string;
    subjects: string[];
    targetTests: string[];
  };
  stats: {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    averageTime: number;
    weakAreas: string[];
    strongAreas: string[];
    totalStudyTime: number;
  };
  streaks: {
    current: number;
    longest: number;
    lastActivity: Date;
  };
}
```

### Question Model
```typescript
{
  content: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay' | 'math';
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hints: string[];
  timeLimit?: number;
  tags: string[];
  createdBy: ObjectId;
}
```

### TestSession Model
```typescript
{
  userId: ObjectId;
  mode: 'practice' | 'timed' | 'daily_challenge';
  questions: ObjectId[];
  answers: {
    questionId: ObjectId;
    answer: string | number;
    timeSpent: number;
    isCorrect: boolean;
    timestamp: Date;
  }[];
  startTime: Date;
  endTime?: Date;
  timeLimit?: number;
  score?: number;
  completed: boolean;
  subject?: string;
  difficulty?: string;
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/forgot-password` - Password reset

### Questions
- `GET /api/questions` - Get questions with filters
- `GET /api/questions/random` - Get random questions
- `GET /api/questions/adaptive` - Get adaptive questions
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Sessions
- `POST /api/sessions` - Create test session
- `GET /api/sessions` - Get user sessions
- `GET /api/sessions/active` - Get active session
- `POST /api/sessions/:id/answer` - Submit answer
- `POST /api/sessions/:id/complete` - Complete session

### Analytics
- `GET /api/analytics/overview` - User analytics overview
- `GET /api/analytics/topics` - Performance by topic
- `GET /api/analytics/recommendations` - AI study recommendations

### Leaderboard
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/daily-challenge` - Daily challenge leaderboard
- `GET /api/leaderboard/subject/:subject` - Subject leaderboard

### Writing
- `POST /api/writing` - Submit writing for critique
- `POST /api/writing/upload` - Upload writing file
- `GET /api/writing` - Get user submissions
- `GET /api/writing/:id` - Get specific submission

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/dashboard` - Dashboard data
- `GET /api/users/achievements` - User achievements

## Socket.io Events

### Client to Server
- `join-practice-room` - Join practice room
- `start-live-practice` - Start live practice session
- `submit-live-answer` - Submit answer in live session
- `join-daily-challenge` - Join daily challenge

### Server to Client
- `session-started` - Live session started
- `answer-result` - Answer feedback
- `next-question` - Next question in sequence
- `session-completed` - Session finished
- `leaderboard-update` - Real-time leaderboard updates

## Development Setup

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- OpenAI API key (for writing critique)

### Quick Start
```bash
# Clone and setup
git clone <repository>
cd testace-app
./setup.sh

# Start development servers
./start-dev.sh
```

### Manual Setup
```bash
# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run build
npx ts-node src/scripts/seedData.ts
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
npm start
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/testace
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your-openai-api-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SERVER_URL=http://localhost:5000
```

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve build folder with nginx or similar
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.
