# 🗄️ DynamoDB Persistence Setup

## Quick Setup

### 1. Run Setup Scripts
```bash
# Setup environment and dependencies
./setup-environment.sh

# Setup DynamoDB tables (requires AWS credentials)
node setup-dynamodb-persistence.js
```

### 2. Configure Amplify Environment Variables
In your Amplify console, add these environment variables (NO AWS_ prefix):
- `TESTACE_ACCESS_KEY_ID`: Your AWS access key
- `TESTACE_SECRET_ACCESS_KEY`: Your AWS secret key  
- `TESTACE_AWS_REGION`: us-east-1 (or your preferred region)

### 3. Deploy
The `amplify.yml` will automatically:
- Create DynamoDB tables
- Migrate existing data
- Enable persistent storage

## What Gets Persisted

### DynamoDB Tables Created:
1. **TestAce-Questions**: All base questions
2. **TestAce-UserProgress**: Individual user progress
3. **TestAce-ReadingPassages**: 185 reading passages
4. **TestAce-GeneratedQuestions**: Auto-generated questions

### Data Migration:
- ✅ All existing questions → DynamoDB
- ✅ Reading passages → DynamoDB  
- ✅ User progress → DynamoDB
- ✅ Generated questions → DynamoDB

## Benefits

### 🎯 **Persistent Data**
- User progress saved across sessions
- Generated questions shared between users
- No data loss on app restart

### 🚀 **Scalable**
- Handles unlimited users
- Auto-scaling with usage
- Pay-per-request pricing

### 🔒 **Reliable**
- AWS managed service
- Automatic backups
- High availability

## Development vs Production

### Development (localhost):
- Uses localStorage fallback
- No AWS credentials needed
- Instant setup

### Production (Amplify):
- Uses DynamoDB automatically
- Persistent across deployments
- Shared user data

## Files Created

1. `setup-dynamodb-persistence.js` - Creates tables and migrates data
2. `frontend/src/services/dynamoDbService.ts` - DynamoDB operations
3. `frontend/src/services/persistentServices.ts` - Service layer
4. `amplify.yml` - Updated build configuration
5. `setup-environment.sh` - Environment setup script

## Ready to Deploy! 🚀

Your TestAce app now has full DynamoDB persistence integrated into the Amplify deployment process.
