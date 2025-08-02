#!/bin/bash

echo "🔧 Fixing AJV Dependency Conflict"
echo "================================="

echo ""
echo "The build failed due to ajv/ajv-keywords version mismatch."
echo "This is a common issue with React apps and webpack dependencies."
echo ""
echo "Choose your fix approach:"
echo "1) Updated package.json with overrides (npm approach)"
echo "2) Use Yarn for better dependency resolution"
echo "3) Force clean install with specific flags"
echo ""
read -p "Enter your choice (1, 2, or 3): " choice

case $choice in
    1)
        echo "📝 Using updated package.json with dependency overrides..."
        echo "✅ package.json already updated with ajv overrides"
        echo "✅ amplify.yml updated with clean install process"
        echo ""
        echo "Changes made:"
        echo "- Added ajv@^8.12.0 and ajv-keywords@^5.1.0 overrides"
        echo "- Fixed @mui/lab version compatibility"
        echo "- Clean install process in amplify.yml"
        ;;
    2)
        echo "📝 Setting up Yarn approach..."
        cp amplify.yml amplify-npm-backup.yml
        cp amplify-yarn.yml amplify.yml
        echo "✅ amplify.yml updated to use Yarn"
        echo ""
        echo "Changes made:"
        echo "- Switched to Yarn for dependency resolution"
        echo "- Added --ignore-engines flag for compatibility"
        echo "- Clean install process with yarn"
        ;;
    3)
        echo "📝 Setting up force clean install..."
        cat > amplify.yml << 'EOF'
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd testace-app/frontend
        - echo "=== Force clean install ==="
        - rm -rf node_modules package-lock.json
        - npm cache clean --force
        - npm install --legacy-peer-deps --force --no-audit --no-fund
        - echo "=== Force install completed ==="
    build:
      commands:
        - echo "=== Building application ==="
        - npm run build
        - echo "=== Build completed ==="
  artifacts:
    baseDirectory: testace-app/frontend/build
    files:
      - '**/*'
  cache:
    paths:
      - testace-app/frontend/node_modules/**/*
EOF
        echo "✅ amplify.yml updated with force clean install"
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
echo "1. Commit changes: git add . && git commit -m 'Fix ajv dependency conflict'"
echo "2. Push to trigger build: git push"
echo "3. Monitor build in Amplify Console"

echo ""
echo "🔍 If build still fails:"
echo "- Try a different approach (run this script again)"
echo "- Check build logs for specific error details"
echo "- Consider updating React Scripts version"

echo ""
echo "💡 Alternative manual fixes:"
echo "- Update react-scripts to latest version"
echo "- Use npm install --force --legacy-peer-deps"
echo "- Switch to Vite instead of Create React App"

echo ""
echo "✅ AJV dependency fix applied!"
