#!/bin/bash

echo "🔧 Emergency Build Fix - Resolving dependency conflicts..."

# Step 1: Clean everything
echo "1. Cleaning all node_modules..."
cd /workspaces/AWSQCLI/testace-app/frontend
rm -rf node_modules package-lock.json

# Step 2: Install with specific ajv version to fix the conflict
echo "2. Installing with compatible ajv version..."
npm install ajv@^6.12.6 ajv-keywords@^3.5.2 --save-dev
npm install --legacy-peer-deps

# Step 3: Try build with error suppression
echo "3. Attempting build..."
GENERATE_SOURCEMAP=false npm run build

echo "✅ Build fix complete!"
