# QuizWiz Deployment Guide

## Quick Start (Development)

### 1. Prerequisites
- Node.js 16+
- Docker (for MongoDB)
- Git

### 2. Setup & Run
```bash
# Navigate to QuizWiz directory
cd quizwiz-app

# Install all dependencies
npm run install:all

# Start MongoDB with Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Load sample questions and create test user
cd backend && node scripts/loadQuestions.js data/sample-questions.json

# Start development servers
./start-dev.sh
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Test User**: test@quizwiz.com / password123

## Manual Development Setup

### Backend Setup
```bash
cd backend
npm install
npm run dev  # Starts on port 5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start    # Starts on port 3000
```

## Production Deployment

### Environment Variables
Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb://your-production-db-uri
JWT_SECRET=your-super-secure-jwt-secret-key
PORT=5000
NODE_ENV=production
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Options

#### 1. Traditional Server
- Deploy backend to Node.js server
- Serve frontend build files with nginx/Apache
- Use MongoDB Atlas or self-hosted MongoDB

#### 2. AWS Deployment
- **Frontend**: AWS Amplify or S3 + CloudFront
- **Backend**: AWS Lambda + API Gateway
- **Database**: MongoDB Atlas or DocumentDB

#### 3. Docker Deployment
```bash
# Create Dockerfile for backend
# Create docker-compose.yml for full stack
docker-compose up -d
```

## Question Management

### Adding Questions
1. Create JSON file with proper format:
```json
[
  {
    "_id": "subject_grade_difficulty_number",
    "question": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Why this is correct"
  }
]
```

2. Load questions:
```bash
cd backend
node scripts/loadQuestions.js path/to/your/questions.json
```

### ID Format Rules
- **Subject**: math, science, english, history, etc.
- **Grade**: 6, 7, 8, 9, 10, 11, 12
- **Difficulty**: easy, medium, hard
- **Number**: Sequential number

Example: `math_9_medium_1`

## Monitoring & Maintenance

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/quizwiz"
```

### Logs
- Backend logs: Console output
- Frontend logs: Browser console
- MongoDB logs: Docker logs mongodb

## Troubleshooting

### Common Issues

1. **Port 5000 in use**
```bash
sudo lsof -ti:5000 | xargs sudo kill -9
```

2. **MongoDB connection failed**
```bash
docker ps | grep mongodb
docker start mongodb
```

3. **Frontend build errors**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

4. **CORS errors**
- Check proxy setting in frontend package.json
- Verify backend CORS configuration

### Performance Optimization

1. **Database Indexing**
- Questions indexed by subject, grade, difficulty
- Quiz results indexed by user and date

2. **Frontend Optimization**
- Code splitting implemented
- Images optimized
- Lazy loading for components

3. **Backend Optimization**
- JWT token caching
- Database connection pooling
- API response compression

## Security Considerations

### Production Security
- Use strong JWT secrets
- Enable HTTPS
- Implement rate limiting
- Validate all inputs
- Use environment variables for secrets

### Database Security
- Enable MongoDB authentication
- Use connection string with credentials
- Regular security updates

## Scaling

### Horizontal Scaling
- Load balancer for backend
- CDN for frontend assets
- Database clustering

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Cache frequently accessed data

---

**Need help?** Check the main README.md or create an issue on GitHub.
