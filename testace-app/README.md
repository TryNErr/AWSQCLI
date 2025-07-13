# 📱 TestAce - Real-Time Selective Booster

A comprehensive educational web application designed for test preparation with adaptive learning, real-time practice modes, AI-powered writing critique, and gamification elements.

![TestAce Dashboard](https://via.placeholder.com/800x400/1976d2/ffffff?text=TestAce+Dashboard)

## 🎯 Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Live Non-Stop Practice Mode** | Auto-refreshing test questions with adaptive difficulty | ✅ Implemented |
| **Timed Mode** | Simulates real test environment with per-section limits | ✅ Implemented |
| **Question Explanation Engine** | Detailed explanations and hints after each answer | ✅ Implemented |
| **Smart Analytics** | Tracks weak areas, progress, and provides insights | ✅ Implemented |
| **Daily Challenge Streak** | Keeps students motivated with daily challenges | ✅ Implemented |
| **Peer Leaderboard** | Competition and gamification features | ✅ Implemented |
| **Writing Critique Upload** | AI feedback on grammar, structure, and clarity | ✅ Implemented |

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Real-time**: Socket.io for live features
- **AI Integration**: OpenAI API for writing analysis
- **File Upload**: Multer for handling uploads

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Real-time**: Socket.io client
- **Animations**: Framer Motion
- **Forms**: React Hook Form

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Development**: Hot reload, TypeScript compilation
- **Production**: Optimized builds, security headers

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Docker & Docker Compose
- OpenAI API key (for writing critique)

### Local Development Setup (Recommended)

**Option 1: Using Docker for MongoDB (Recommended)**
```bash
git clone <repository>
cd testace-app
./setup-local.sh
```

This will:
- Start MongoDB in a Docker container
- Install all dependencies
- Build the backend
- Seed the database with sample data

**Option 2: Using System MongoDB**
```bash
git clone <repository>
cd testace-app
./setup.sh
```

### Start Development Servers

**For Docker-based MongoDB:**
```bash
./start-local.sh
```

**For System MongoDB:**
```bash
./start-dev.sh
```

This will start:
- MongoDB (Docker container on port 27017)
- Backend server (port 5000)
- Frontend server (port 3000)

### Demo Credentials
- **Email**: demo@testace.com
- **Password**: demo123

## 🗄️ Database Management

Use the database management script for easy MongoDB operations:

```bash
# Start MongoDB container
./db-manage.sh start

# Stop MongoDB container
./db-manage.sh stop

# View MongoDB logs
./db-manage.sh logs

# Open MongoDB shell
./db-manage.sh shell

# Check container status
./db-manage.sh status

# Clean all data (destructive)
./db-manage.sh clean
```

## Project Structure
```
testace-app/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── shared/            # Shared types and utilities
└── docs/              # Documentation
```

## Getting Started
1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Run the development servers
