# 🚀 TestAce Local Development

## Quick Start

### Option 1: One-Command Startup (Recommended)
```bash
npm run start:local
```
This will:
- Install all dependencies
- Generate static questions
- Start both backend and frontend
- Show you the URLs and status

### Option 2: Manual Startup
```bash
# Install dependencies
npm run install:all

# Generate static questions (one-time)
npm run generate-questions

# Start backend (Terminal 1)
npm run start:backend

# Start frontend (Terminal 2)  
npm run start:frontend
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000  
- **Health Check**: http://localhost:5000/health

## 📊 Question Management

### Check Question Bank Status
```bash
npm run question-status
```

### Add More Questions
```bash
# Add 100 questions to a specific combination
npm run question-add 9 hard thinking-skills 100
```

### Auto-Refill Low Banks
```bash
npm run question-refill
```

## 🛠️ Development Commands

```bash
# Install all dependencies
npm run install:all

# Generate static questions
npm run generate-questions

# Start services individually
npm run start:frontend    # Frontend only
npm run start:backend     # Backend only
npm run dev:backend       # Backend with auto-reload

# Build everything
npm run build:all

# Clean node_modules
npm run clean

# Update dependencies
npm run update:deps
```

## 📁 Project Structure

```
testace-app/
├── frontend/           # React frontend
├── backend/           # Node.js backend  
├── scripts/           # Build-time question generation
├── public/questions/  # Static question files (2,700 questions)
└── start-local.sh     # Local development startup script
```

## 🔧 Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/testace
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend
No additional configuration needed - uses static question files.

## 🎯 Features

### ⚡ Static Questions
- **2,700 pre-generated questions** in 108 combinations
- **Instant loading** (< 50ms) - no generation delays
- **No hanging issues** - questions load from static files

### 🔄 Question Management
- Monitor question bank levels
- Add more questions when needed
- Auto-refill low banks

### 🛡️ Fallback Protection
- Static files first (instant)
- Fallback to generation if needed
- Comprehensive error handling

## 🧪 Testing

### Test Question Loading
1. Go to http://localhost:3000
2. Navigate to Practice
3. Select Grade 9, Hard, Thinking Skills
4. Should see 25 questions load instantly

### Test Question Banks
```bash
# Check status
npm run question-status

# Should show all banks healthy with 25 questions each
```

## 🚨 Troubleshooting

### Backend Won't Start
```bash
# Check if MongoDB is running
mongod --version

# Or use the simple server (no MongoDB required)
cd backend && npm start
```

### Frontend Build Issues
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Missing Questions
```bash
# Regenerate all questions
npm run generate-questions

# Check status
npm run question-status
```

### Port Conflicts
- Frontend: Change port in `frontend/package.json`
- Backend: Change PORT in `backend/.env`

## 📈 Performance

- **App Startup**: < 5 seconds
- **Question Loading**: < 50ms (from static files)
- **Memory Usage**: ~5.4MB for all questions
- **No Hanging**: Eliminated completely

## 🎉 Success Indicators

✅ Backend starts and shows "Backend server running on port 5000"  
✅ Frontend opens at http://localhost:3000  
✅ Questions load instantly without delays  
✅ Grade 9 Hard Thinking Skills shows 25 questions  
✅ No hanging or freezing during question selection  

---

**Happy coding! 🚀**
