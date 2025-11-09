# Quiz_App - Amplify v2 Deployment

Basic Amplify v2 project with frontend and backend integration.

## Structure
- `index.html` - Frontend page
- `src/main.js` - Frontend logic
- `amplify/backend/` - Lambda backend function

## Local Development
```bash
npm install
npm run dev
```

## Deployment
Auto-deploys when pushed to `quiz-app-amplify-v2` branch via Amplify pipeline.

## Backend API
- `/health` - Health check endpoint
