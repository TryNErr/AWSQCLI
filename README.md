# TestAce Educational App

A comprehensive educational testing platform built with React and Node.js, deployable on AWS.

## 🚀 Quick Deploy to AWS

### Option 1: One-Click Amplify Deployment (Recommended)

[![Deploy to AWS Amplify](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/your-username/AWSQCLI)

**Or run locally:**
```bash
./deploy-amplify.sh
```

### Option 2: Lambda + S3 Deployment
```bash
cd testace-app
./deploy-to-aws.sh prod us-east-1
```

## 📁 Project Structure

```
AWSQCLI/
├── testace-app/                 # Main application
│   ├── frontend/               # React frontend
│   ├── backend/                # Node.js backend
│   └── deploy-to-aws.sh       # Lambda deployment script
├── amplify.yml                 # Amplify build configuration
├── deploy-amplify.sh          # Amplify deployment script
└── README.md                  # This file
```

## 🎯 Features

- **Frontend**: React with TypeScript, Material-UI
- **Backend**: Node.js with Express, MongoDB
- **Authentication**: JWT-based auth system
- **Real-time**: Socket.io for live features
- **Testing**: Comprehensive question system
- **Analytics**: User progress tracking
- **Responsive**: Mobile-friendly design

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- MongoDB (or use Docker)
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/AWSQCLI.git
cd AWSQCLI

# Install dependencies
npm run install:all

# Start development servers
npm run start:frontend  # Frontend on http://localhost:3000
npm run start:backend   # Backend on http://localhost:5000
```

## 🌐 Deployment Options

### 1. AWS Amplify (Frontend + Hosting)
- **Best for**: Frontend hosting with CDN
- **Features**: Automatic deployments, SSL, custom domains
- **Cost**: ~$5-15/month for small apps
- **Setup**: See [AMPLIFY_DEPLOYMENT.md](AMPLIFY_DEPLOYMENT.md)

### 2. AWS Lambda (Full Stack)
- **Best for**: Complete serverless deployment
- **Features**: Auto-scaling, pay-per-request
- **Cost**: ~$8-30/month for typical usage
- **Setup**: See [testace-app/AWS_LAMBDA_DEPLOYMENT_GUIDE.md](testace-app/AWS_LAMBDA_DEPLOYMENT_GUIDE.md)

### 3. Docker Deployment
```bash
cd testace-app
docker-compose up -d
```

## 📊 Architecture

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Query + Context
- **Routing**: React Router v6
- **Real-time**: Socket.io client

### Backend (Node.js)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Real-time**: Socket.io server
- **API**: RESTful endpoints

### AWS Services Used
- **Amplify**: Frontend hosting and CI/CD
- **Lambda**: Serverless backend functions
- **API Gateway**: REST API management
- **S3**: Static file storage
- **CloudFront**: Global CDN
- **DynamoDB**: NoSQL database (optional)

## 🔧 Configuration

### Environment Variables

**Frontend (.env.production):**
```env
REACT_APP_API_URL=https://your-api-url.amazonaws.com/prod
REACT_APP_ENVIRONMENT=production
```

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/testace
JWT_SECRET=your-jwt-secret
PORT=5000
```

## 🧪 Testing

```bash
# Run frontend tests
cd testace-app/frontend && npm test

# Run backend tests
cd testace-app/backend && npm test

# Test deployment
node testace-app/test-deployment.js
```

## 📈 Monitoring

### AWS CloudWatch
- Lambda function logs
- API Gateway metrics
- Error tracking

### Amplify Console
- Build logs
- Performance metrics
- User analytics

## 🔒 Security

- ✅ HTTPS by default
- ✅ JWT authentication
- ✅ Input validation
- ✅ CORS configuration
- ✅ Security headers
- ✅ Rate limiting

## 💰 Cost Estimation

### Small App (< 1000 users/month)
- **Amplify**: $5-10/month
- **Lambda**: $1-5/month
- **API Gateway**: $3-8/month
- **Total**: ~$9-23/month

### Medium App (1000-10000 users/month)
- **Amplify**: $10-25/month
- **Lambda**: $5-15/month
- **API Gateway**: $8-25/month
- **Total**: ~$23-65/month

## 🚀 Quick Start Commands

```bash
# 1-Click Amplify Deployment
./deploy-amplify.sh

# Lambda Deployment
cd testace-app && ./deploy-to-aws.sh prod us-east-1

# Local Development
npm run install:all && npm run start:frontend

# Build for Production
npm run build:all

# Run Tests
npm test
```

## 📚 Documentation

- [Amplify Deployment Guide](AMPLIFY_DEPLOYMENT.md)
- [Lambda Deployment Guide](testace-app/AWS_LAMBDA_DEPLOYMENT_GUIDE.md)
- [Development Guide](testace-app/docs/DEVELOPMENT.md)
- [API Documentation](testace-app/docs/API.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/AWSQCLI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/AWSQCLI/discussions)
- **AWS Support**: Available in AWS Console

---

**Ready to deploy?** Click the Amplify button above or run `./deploy-amplify.sh` for instant deployment! 🚀
