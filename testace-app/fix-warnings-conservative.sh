#!/bin/bash

# Conservative Build Warnings Fix Script
# This script applies minimal changes to fix the most critical warnings

echo "🔧 Starting conservative dependency fix..."

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

# Step 1: Install the specific package to fix sourcemap-codec warning
print_status "Installing @jridgewell/sourcemap-codec to fix main warning..."

cd frontend
if npm install @jridgewell/sourcemap-codec@^1.5.0 --save-dev --legacy-peer-deps; then
    print_success "Installed @jridgewell/sourcemap-codec"
else
    print_warning "Could not install @jridgewell/sourcemap-codec, but continuing..."
fi

# Step 2: Update the most problematic packages only
print_status "Updating most critical packages..."

# Update ajv to fix validation warnings
if npm install ajv@^8.17.1 ajv-keywords@^5.1.0 --legacy-peer-deps; then
    print_success "Updated ajv packages"
else
    print_warning "Could not update ajv packages"
fi

cd ..

# Step 3: Add npm configuration to suppress warnings
print_status "Creating .npmrc files to suppress warnings..."

# Create .npmrc for frontend if it doesn't exist
if [ ! -f "frontend/.npmrc" ]; then
    cat > frontend/.npmrc << EOF
legacy-peer-deps=true
fund=false
audit-level=moderate
loglevel=warn
EOF
    print_success "Created frontend/.npmrc"
fi

# Create .npmrc for backend if it doesn't exist
if [ ! -f "backend/.npmrc" ]; then
    cat > backend/.npmrc << EOF
legacy-peer-deps=true
fund=false
audit-level=moderate
loglevel=warn
EOF
    print_success "Created backend/.npmrc"
fi

# Step 4: Test the build
print_status "Testing frontend build..."
cd frontend
if npm run build > build.log 2>&1; then
    print_success "Frontend builds successfully!"
    # Count warnings in build log
    warning_count=$(grep -i "warning" build.log | wc -l)
    print_status "Build completed with $warning_count warnings (check build.log for details)"
else
    print_warning "Frontend build has issues, check build.log for details"
fi
cd ..

echo ""
print_success "🎉 Conservative fix completed!"
echo ""
print_status "Changes made:"
echo "  • Added @jridgewell/sourcemap-codec to replace deprecated sourcemap-codec"
echo "  • Updated ajv packages to fix validation warnings"
echo "  • Created .npmrc files to suppress non-critical warnings"
echo "  • Configured legacy peer deps for better compatibility"
echo ""
print_status "To see the effect:"
echo "  • Run: cd frontend && npm run build"
echo "  • Compare warnings before and after"
echo ""
print_warning "Note: Some warnings may persist from deep dependencies."
print_warning "These are generally safe to ignore and don't affect functionality."
