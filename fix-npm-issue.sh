#!/bin/bash

echo "🔧 Fixing npm ci issue for Amplify deployment"
echo "=============================================="

cd testace-app/frontend

echo "📦 Current package.json status:"
if [ -f "package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json missing"
    exit 1
fi

echo "🔍 Checking for package-lock.json:"
if [ -f "package-lock.json" ]; then
    echo "✅ package-lock.json exists"
    echo "📝 Using npm ci approach"
    
    # Update amplify.yml to use npm ci
    cd ../../
    cat > amplify.yml << 'EOF'
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd testace-app/frontend
        - npm ci --legacy-peer-deps
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
    
else
    echo "⚠️  package-lock.json missing"
    echo "📝 Creating package-lock.json..."
    
    # Try to create package-lock.json
    npm install --legacy-peer-deps --package-lock-only
    
    if [ -f "package-lock.json" ]; then
        echo "✅ package-lock.json created successfully"
        echo "📝 Using npm ci approach"
        
        # Update amplify.yml to use npm ci
        cd ../../
        cat > amplify.yml << 'EOF'
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd testace-app/frontend
        - npm ci --legacy-peer-deps
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
        
    else
        echo "❌ Failed to create package-lock.json"
        echo "📝 Using npm install approach instead"
        
        # Update amplify.yml to use npm install
        cd ../../
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
    fi
fi

echo ""
echo "📋 Final amplify.yml configuration:"
echo "==================================="
cat ../../amplify.yml

echo ""
echo "✅ Fix completed!"
echo ""
echo "🚀 Next steps:"
echo "1. Commit the changes: git add . && git commit -m 'Fix npm ci issue'"
echo "2. Push to trigger new build: git push"
echo "3. Or trigger manual build in Amplify Console"

echo ""
echo "🔍 If build still fails, the issue might be:"
echo "- Dependency conflicts in package.json"
echo "- Missing dependencies"
echo "- Node.js version compatibility"
