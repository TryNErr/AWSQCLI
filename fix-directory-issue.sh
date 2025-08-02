#!/bin/bash

echo "🔧 Fixing Amplify Directory Structure Issue"
echo "==========================================="

echo ""
echo "The build failed because Amplify couldn't find 'testace-app/frontend' directory."
echo "This usually happens when the build runs from a different working directory."
echo ""
echo "Choose your fix approach:"
echo "1) Debug version (shows directory structure during build)"
echo "2) Monorepo version (uses AMPLIFY_MONOREPO_APP_ROOT)"
echo "3) Simple version (assumes standard structure)"
echo ""
read -p "Enter your choice (1, 2, or 3): " choice

case $choice in
    1)
        echo "📝 Setting up debug version..."
        cp amplify.yml amplify-backup.yml
        echo "✅ Current amplify.yml backed up"
        echo "✅ Debug version is already active"
        echo ""
        echo "⚠️  This version will show detailed directory information during build"
        echo "   Use this to understand the actual directory structure in Amplify"
        ;;
    2)
        echo "📝 Setting up monorepo version..."
        cp amplify.yml amplify-backup.yml
        cp amplify-monorepo-fixed.yml amplify.yml
        echo "✅ amplify.yml updated for monorepo approach"
        echo ""
        echo "⚠️  IMPORTANT: Set environment variable in Amplify Console:"
        echo "   Variable: AMPLIFY_MONOREPO_APP_ROOT"
        echo "   Value: testace-app"
        echo ""
        echo "   Steps:"
        echo "   1. Go to Amplify Console → Your App → App Settings → Environment Variables"
        echo "   2. Add: AMPLIFY_MONOREPO_APP_ROOT = testace-app"
        echo "   3. Save and redeploy"
        ;;
    3)
        echo "📝 Setting up simple version..."
        cp amplify.yml amplify-backup.yml
        cat > amplify.yml << 'EOF'
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd testace-app/frontend
        - npm install --legacy-peer-deps
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
  customHeaders:
    - pattern: '**/*'
      headers:
        - key: 'X-Frame-Options'
          value: 'DENY'
        - key: 'X-XSS-Protection'
          value: '1; mode=block'
        - key: 'X-Content-Type-Options'
          value: 'nosniff'
EOF
        echo "✅ amplify.yml updated for simple approach"
        echo ""
        echo "⚠️  Make sure AMPLIFY_MONOREPO_APP_ROOT is NOT set in environment variables"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again and choose 1, 2, or 3."
        exit 1
        ;;
esac

echo ""
echo "📋 Current amplify.yml content:"
echo "==============================="
cat amplify.yml

echo ""
echo "🚀 Next steps:"
echo "1. If using option 2, set the environment variable in Amplify Console"
echo "2. Commit changes: git add amplify.yml && git commit -m 'Fix directory structure'"
echo "3. Push to trigger build: git push"
echo "4. Monitor build logs in Amplify Console"

echo ""
echo "🔍 If build still fails:"
echo "- Check the build logs for the actual directory structure"
echo "- The debug version (option 1) will show you exactly what directories exist"
echo "- You may need to adjust the paths based on what Amplify actually sees"

echo ""
echo "✅ Directory structure fix applied!"
