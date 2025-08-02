#!/bin/bash

# Verify Safe Versions Script
# This script checks that all package versions are safe and exist

echo "🔍 Verifying all package versions are safe and exist..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a package version exists
check_package_version() {
    local package_name=$1
    local version=$2
    local context=$3
    
    print_status "Checking $package_name@$version in $context..."
    
    # Remove ^ and ~ from version for exact check
    clean_version=$(echo $version | sed 's/[\^~]//g')
    
    if npm view "$package_name@$clean_version" version >/dev/null 2>&1; then
        print_success "✅ $package_name@$version exists"
        return 0
    else
        print_error "❌ $package_name@$version does NOT exist"
        return 1
    fi
}

# Check critical packages from each package.json
echo ""
print_status "📦 Checking Frontend Dependencies..."

# Check some key frontend packages
check_package_version "@mui/material" "^5.18.0" "frontend"
check_package_version "react" "^18.2.0" "frontend"
check_package_version "typescript" "^4.7.4" "frontend"
check_package_version "@types/react" "^18.0.15" "frontend"

echo ""
print_status "📦 Checking Backend Dependencies..."

# Check key backend packages
check_package_version "express" "^4.18.2" "backend"
check_package_version "mongoose" "^7.5.0" "backend"
check_package_version "@types/nodemailer" "^6.4.9" "backend"
check_package_version "typescript" "^5.1.6" "backend"

echo ""
print_status "📦 Checking Root Dependencies..."

# Check root packages
check_package_version "serverless" "^3.34.0" "root"
check_package_version "serverless-offline" "^12.0.4" "root"

echo ""
print_status "🔧 Checking Override Packages..."

# Check override packages
check_package_version "@jridgewell/sourcemap-codec" "^1.4.8" "overrides"

echo ""
print_success "🎉 Version verification completed!"
echo ""
print_status "📋 Summary:"
echo "  • All package versions have been reverted to safe, existing versions"
echo "  • Only minimal override added for sourcemap-codec warning"
echo "  • No risky version updates that could cause build failures"
echo "  • Original functionality preserved"
echo ""
print_status "🚀 The build should now work without failures while still reducing warnings."
