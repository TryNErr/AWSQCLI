#!/bin/bash

# Emergency Fix - Revert to Safe Versions
# This script reverts problematic version updates to prevent build failures

echo "🚨 EMERGENCY FIX: Reverting to safe dependency versions..."

# Restore original package.json files if backups exist
if [ -f "frontend/package.json.backup" ]; then
    echo "✅ Restoring frontend/package.json from backup..."
    cp frontend/package.json.backup frontend/package.json
fi

if [ -f "backend/package.json.backup" ]; then
    echo "✅ Restoring backend/package.json from backup..."
    cp backend/package.json.backup backend/package.json
fi

if [ -f "package.json.backup" ]; then
    echo "✅ Restoring root package.json from backup..."
    cp package.json.backup package.json
fi

# Now add ONLY the critical overrides without version updates
echo "📦 Adding minimal overrides to fix warnings without breaking versions..."

# Add minimal overrides to frontend package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));

// Only add the most critical overrides
pkg.overrides = {
  ...pkg.overrides,
  'sourcemap-codec': 'npm:@jridgewell/sourcemap-codec@^1.4.8',
  '@jridgewell/sourcemap-codec': '^1.4.8'
};

pkg.resolutions = {
  ...pkg.resolutions,
  'sourcemap-codec': 'npm:@jridgewell/sourcemap-codec@^1.4.8',
  '@jridgewell/sourcemap-codec': '^1.4.8'
};

fs.writeFileSync('frontend/package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Added minimal overrides to frontend/package.json');
"

# Add minimal overrides to backend package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));

// Only add the most critical overrides
pkg.overrides = {
  ...pkg.overrides,
  'sourcemap-codec': 'npm:@jridgewell/sourcemap-codec@^1.4.8',
  '@jridgewell/sourcemap-codec': '^1.4.8'
};

pkg.resolutions = {
  ...pkg.resolutions,
  'sourcemap-codec': 'npm:@jridgewell/sourcemap-codec@^1.4.8',
  '@jridgewell/sourcemap-codec': '^1.4.8'
};

fs.writeFileSync('backend/package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Added minimal overrides to backend/package.json');
"

echo ""
echo "🎉 Emergency fix completed!"
echo ""
echo "✅ What was done:"
echo "  • Restored original package.json files from backups"
echo "  • Added ONLY the critical sourcemap-codec override"
echo "  • Used compatible version ^1.4.8 instead of ^1.5.0"
echo "  • Removed all risky version updates"
echo ""
echo "🚀 This should resolve the build failure while still fixing the main warning."
