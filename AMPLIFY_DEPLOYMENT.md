# 🚀 TestAce AWS Amplify Deployment Guide

This guide will help you deploy your TestAce application to AWS Amplify with 1-click deployment.

## 🎯 Quick Start (1-Click Deployment)

### Option 1: Automated Script (Recommended)
```bash
./deploy-amplify.sh
```

### Option 2: Manual Amplify Console Deployment
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Select the `master` branch
5. Amplify will automatically detect the `amplify.yml` configuration
6. Click "Save and deploy"

## 📋 Prerequisites

1. **AWS Account**: [Sign up here](https://aws.amazon.com/free/)
2. **AWS CLI**: Installed and configured
3. **Node.js**: Version 18+ installed
4. **Git**: Repository connected to GitHub/GitLab/Bitbucket

## 🔧 Configuration Files Created

### 1. `amplify.yml` (Root Level)
This file tells Amplify how to build your app from the subfolder:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd testace-app/frontend
        - npm ci
    build:
      commands:
        - cd testace-app/frontend
        - npm run build
  artifacts:
    baseDirectory: testace-app/frontend/build
    files:
      - '**/*'
  cache:
    paths:
      - testace-app/frontend/node_modules/**/*
```

### 2. Environment Variables
- `.env.production`: Production environment settings
- `.env.development`: Development environment settings

### 3. Root `package.json`
Provides workspace management and deployment scripts.

## 🚀 Deployment Process

### Automatic Deployment (Recommended)

1. **Run the deployment script:**
   ```bash
   ./deploy-amplify.sh
   ```

2. **What happens automatically:**
   - ✅ Checks AWS credentials
   - ✅ Installs Amplify CLI if needed
   - ✅ Installs project dependencies
   - ✅ Initializes Amplify project
   - ✅ Configures hosting
   - ✅ Deploys your app
   - ✅ Provides live URL

### Manual Deployment

1. **Install Amplify CLI:**
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Configure AWS credentials:**
   ```bash
   aws configure
   ```

3. **Initialize Amplify:**
   ```bash
   amplify init
   ```

4. **Add hosting:**
   ```bash
   amplify add hosting
   ```

5. **Deploy:**
   ```bash
   amplify publish
   ```

## 🌐 Frontend + Backend Deployment

### Frontend (Amplify Hosting)
- **What**: React application hosted on Amplify
- **URL**: `https://your-app-id.amplifyapp.com`
- **Features**: CDN, SSL, custom domains

### Backend (AWS Lambda)
For the backend, you have two options:

#### Option A: Amplify Functions (Recommended for simple APIs)
```bash
amplify add function
amplify push
```

#### Option B: Separate Lambda Deployment (Recommended for complex backends)
Use the existing serverless deployment:
```bash
cd testace-app
./deploy-to-aws.sh prod us-east-1
```

Then update your frontend environment variables to point to the Lambda API.

## 🔄 Continuous Deployment

### Automatic Deployments
Once connected to your Git repository, Amplify will automatically:
- ✅ Deploy on every push to `master` branch
- ✅ Build and test your application
- ✅ Update the live site
- ✅ Send notifications on deployment status

### Branch-based Deployments
- `master` → Production (`https://master.your-app-id.amplifyapp.com`)
- `develop` → Staging (`https://develop.your-app-id.amplifyapp.com`)
- Feature branches → Preview URLs

## 🛠️ Environment Configuration

### Production Environment Variables
Set these in Amplify Console → App Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

### Build Settings
The `amplify.yml` file handles build configuration automatically.

## 📊 Monitoring & Analytics

### Built-in Monitoring
- **Access Logs**: View in Amplify Console
- **Performance**: Core Web Vitals tracking
- **Errors**: Real-time error monitoring
- **Traffic**: User analytics and metrics

### Custom Monitoring
Add CloudWatch integration for advanced monitoring:
```bash
amplify add analytics
```

## 💰 Cost Estimation

### Amplify Hosting Costs
- **Build minutes**: $0.01 per build minute
- **Data transfer**: $0.15 per GB
- **Storage**: $0.023 per GB per month
- **Requests**: $0.20 per million requests

### Typical Monthly Costs
- **Small app** (< 1000 users): $5-15/month
- **Medium app** (1000-10000 users): $15-50/month
- **Large app** (10000+ users): $50-200/month

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails - "Cannot find module"**
   ```bash
   # Solution: Check package.json paths
   cd testace-app/frontend && npm install
   ```

2. **"Access Denied" during deployment**
   ```bash
   # Solution: Check AWS credentials
   aws configure
   amplify configure
   ```

3. **Frontend loads but API calls fail**
   ```bash
   # Solution: Update environment variables
   # Set REACT_APP_API_URL in Amplify Console
   ```

4. **Build timeout**
   ```bash
   # Solution: Optimize build process
   # Add to amplify.yml:
   # build:
   #   commands:
   #     - npm run build --max_old_space_size=4096
   ```

### Debug Commands

```bash
# Check Amplify status
amplify status

# View build logs
amplify console

# Test local build
cd testace-app/frontend && npm run build

# Check AWS credentials
aws sts get-caller-identity
```

## 🔒 Security Best Practices

### Implemented Security Features
- ✅ HTTPS by default
- ✅ Security headers configured
- ✅ Environment variables for sensitive data
- ✅ CORS properly configured
- ✅ Content Security Policy headers

### Additional Security (Optional)
```bash
# Add authentication
amplify add auth

# Add API with authentication
amplify add api
```

## 🚀 Advanced Features

### Custom Domain
1. Go to Amplify Console → Domain Management
2. Add your domain (e.g., `testace.com`)
3. Amplify handles SSL certificate automatically

### Performance Optimization
- ✅ Automatic CDN (CloudFront)
- ✅ Image optimization
- ✅ Gzip compression
- ✅ Browser caching

### A/B Testing
```bash
amplify add predictions
```

## 📱 Mobile App Support

Amplify also supports mobile app deployment:
```bash
# For React Native
amplify add codegen --apiId your-api-id

# For Flutter
amplify add codegen --apiId your-api-id
```

## 🔄 Update Deployment

### Update Frontend
```bash
# Automatic (on git push)
git add .
git commit -m "Update frontend"
git push origin master

# Manual
amplify publish
```

### Update Backend
```bash
cd testace-app
./deploy-to-aws.sh prod us-east-1
```

## 🗑️ Cleanup

### Remove Amplify App
```bash
amplify delete
```

### Remove Backend Resources
```bash
cd testace-app
serverless remove --stage prod
```

## 📞 Support

### Getting Help
1. **AWS Amplify Documentation**: [docs.amplify.aws](https://docs.amplify.aws)
2. **AWS Support**: Available in AWS Console
3. **Community**: [GitHub Discussions](https://github.com/aws-amplify/amplify-cli/discussions)

### Useful Commands
```bash
# Get help
amplify help

# Check version
amplify --version

# Update Amplify CLI
npm update -g @aws-amplify/cli
```

## 🎉 Success!

After deployment, you'll have:
- ✅ **Live Frontend**: Hosted on Amplify with CDN
- ✅ **Automatic Deployments**: On every git push
- ✅ **SSL Certificate**: HTTPS by default
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Monitoring**: Built-in analytics and logs
- ✅ **Scalability**: Handles traffic spikes automatically

Your TestAce app is now production-ready on AWS Amplify! 🚀

## 🔗 Quick Links

- [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
- [Amplify CLI Documentation](https://docs.amplify.aws/cli/)
- [React Deployment Guide](https://docs.amplify.aws/guides/hosting/react/)
- [Custom Domain Setup](https://docs.amplify.aws/console/custom-domains/)
- [Environment Variables](https://docs.amplify.aws/console/environment-variables/)

---

**Ready to deploy?** Run `./deploy-amplify.sh` and your app will be live in minutes! 🚀
