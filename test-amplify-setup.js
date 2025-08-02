#!/usr/bin/env node

/**
 * TestAce Amplify Setup Verification Script
 * This script verifies that all necessary files are in place for Amplify deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 TestAce Amplify Setup Verification');
console.log('=====================================\n');

const checks = [
  {
    name: 'Root amplify.yml configuration',
    path: './amplify.yml',
    required: true
  },
  {
    name: 'Root package.json',
    path: './package.json',
    required: true
  },
  {
    name: 'Frontend package.json',
    path: './testace-app/frontend/package.json',
    required: true
  },
  {
    name: 'Frontend public/index.html',
    path: './testace-app/frontend/public/index.html',
    required: true
  },
  {
    name: 'Frontend src/index.tsx',
    path: './testace-app/frontend/src/index.tsx',
    required: true
  },
  {
    name: 'Frontend src/App.tsx',
    path: './testace-app/frontend/src/App.tsx',
    required: true
  },
  {
    name: 'Production environment config',
    path: './testace-app/frontend/.env.production',
    required: false
  },
  {
    name: 'Development environment config',
    path: './testace-app/frontend/.env.development',
    required: false
  },
  {
    name: 'Deployment script',
    path: './deploy-amplify.sh',
    required: true
  },
  {
    name: 'Amplify deployment guide',
    path: './AMPLIFY_DEPLOYMENT.md',
    required: false
  }
];

let allPassed = true;
let passedCount = 0;

checks.forEach(check => {
  const exists = fs.existsSync(check.path);
  const status = exists ? '✅' : (check.required ? '❌' : '⚠️');
  const message = exists ? 'Found' : (check.required ? 'Missing (Required)' : 'Missing (Optional)');
  
  console.log(`${status} ${check.name}: ${message}`);
  
  if (exists) {
    passedCount++;
  } else if (check.required) {
    allPassed = false;
  }
});

console.log(`\n📊 Results: ${passedCount}/${checks.length} files found`);

if (allPassed) {
  console.log('\n🎉 All required files are present!');
  console.log('✅ Your project is ready for Amplify deployment');
  console.log('\n🚀 To deploy, run: ./deploy-amplify.sh');
  console.log('🌐 Or use the Amplify Console with the GitHub integration');
} else {
  console.log('\n❌ Some required files are missing');
  console.log('Please ensure all required files are created before deployment');
}

// Additional checks
console.log('\n🔧 Additional Checks:');

// Check if deploy script is executable
try {
  const stats = fs.statSync('./deploy-amplify.sh');
  const isExecutable = !!(stats.mode & parseInt('111', 8));
  console.log(`${isExecutable ? '✅' : '⚠️'} Deploy script executable: ${isExecutable ? 'Yes' : 'No (run: chmod +x deploy-amplify.sh)'}`);
} catch (e) {
  console.log('❌ Deploy script not found');
}

// Check amplify.yml content
try {
  const amplifyConfig = fs.readFileSync('./amplify.yml', 'utf8');
  const hasCorrectPath = amplifyConfig.includes('testace-app/frontend');
  console.log(`${hasCorrectPath ? '✅' : '❌'} Amplify config has correct paths: ${hasCorrectPath ? 'Yes' : 'No'}`);
} catch (e) {
  console.log('❌ Could not read amplify.yml');
}

console.log('\n📚 Documentation:');
console.log('- Amplify Deployment Guide: AMPLIFY_DEPLOYMENT.md');
console.log('- Lambda Deployment Guide: testace-app/AWS_LAMBDA_DEPLOYMENT_GUIDE.md');
console.log('- Main README: README.md');

console.log('\n🆘 Need help?');
console.log('- Check the deployment guides above');
console.log('- Ensure AWS CLI is configured: aws configure');
console.log('- Install Amplify CLI: npm install -g @aws-amplify/cli');

process.exit(allPassed ? 0 : 1);
