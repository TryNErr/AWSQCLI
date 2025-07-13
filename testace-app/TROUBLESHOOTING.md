# TestAce Troubleshooting Guide

## Quick Solutions

### 1. **Recommended: Use the Working Script**
```bash
./start-working.sh
```
This bypasses TypeScript compilation issues and provides a simplified but functional backend.

### 2. **Alternative: Use the Local Script with Fallbacks**
```bash
./start-local.sh
```
This tries multiple approaches to start the backend.

## Common Issues and Solutions

### MongoDB Issues

**Problem**: MongoDB connection errors
**Solutions**:
```bash
# Check if MongoDB container is running
./db-manage.sh status

# Start MongoDB if not running
./db-manage.sh start

# View MongoDB logs
./db-manage.sh logs

# Restart MongoDB
./db-manage.sh restart
```

### TypeScript Compilation Errors

**Problem**: Backend fails to compile due to TypeScript errors
**Root Cause**: Strict TypeScript settings and version compatibility issues

**Solutions**:
1. **Use the working script** (recommended):
   ```bash
   ./start-working.sh
   ```

2. **Use transpile-only mode**:
   ```bash
   cd backend
   npx ts-node --transpile-only src/server.ts
   ```

3. **Use built JavaScript** (if available):
   ```bash
   cd backend
   node dist/server.js
   ```

### OpenAI API Issues

**Problem**: OpenAI API key errors
**Solution**: The backend now handles missing API keys gracefully. Writing analysis will use fallback responses.

To enable full AI features:
1. Get an OpenAI API key from https://platform.openai.com/
2. Update `backend/.env`:
   ```
   OPENAI_API_KEY=your-actual-api-key-here
   ```

### Frontend Issues

**Problem**: Frontend won't start or has dependency issues
**Solutions**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port Conflicts

**Problem**: Ports 3000, 5000, or 27017 are already in use
**Solutions**:
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :5000
lsof -i :27017

# Kill processes if needed
kill -9 <PID>
```

## Development Modes

### 1. Working Mode (Recommended for Development)
- **Script**: `./start-working.sh`
- **Backend**: Simplified JavaScript server
- **Features**: Basic API endpoints, MongoDB connection
- **Pros**: Always works, fast startup
- **Cons**: Limited features until TypeScript issues are resolved

### 2. Full Mode (When TypeScript Issues Are Resolved)
- **Script**: `./start-local.sh`
- **Backend**: Full TypeScript application
- **Features**: All features including AI integration
- **Pros**: Complete functionality
- **Cons**: May fail due to TypeScript compilation errors

## Database Management

```bash
# Start MongoDB
./db-manage.sh start

# Stop MongoDB
./db-manage.sh stop

# View logs
./db-manage.sh logs

# Open MongoDB shell
./db-manage.sh shell

# Check status
./db-manage.sh status

# Clean all data (destructive)
./db-manage.sh clean
```

## Environment Variables

Ensure `backend/.env` contains:
```env
MONGODB_URI=mongodb://localhost:27017/testace
JWT_SECRET=your-super-secret-jwt-key-for-local-development
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-placeholder-key-replace-with-real-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Testing the Setup

1. **Test MongoDB**:
   ```bash
   ./db-manage.sh status
   ```

2. **Test Backend**:
   ```bash
   curl http://localhost:5000/health
   ```

3. **Test Frontend**:
   Open http://localhost:3000 in your browser

## Getting Help

If you're still having issues:

1. **Check logs**:
   - MongoDB: `./db-manage.sh logs`
   - Backend: Check the terminal where you ran the start script
   - Frontend: Check browser console

2. **Try the working script**:
   ```bash
   ./start-working.sh
   ```

3. **Clean restart**:
   ```bash
   # Stop everything
   docker-compose -f docker-compose.local.yml down
   
   # Clean frontend
   cd frontend && rm -rf node_modules && npm install && cd ..
   
   # Start fresh
   ./start-working.sh
   ```

## Next Steps

Once you have the application running:

1. **Configure OpenAI API** for full AI features
2. **Resolve TypeScript issues** for full backend functionality
3. **Add your content** and customize the application
4. **Set up production deployment** when ready

## Current Status

✅ **Working**: MongoDB, Basic Backend, Frontend, Database Management
⚠️ **Partial**: TypeScript compilation, AI features (requires API key)
🔧 **In Progress**: Full backend functionality
