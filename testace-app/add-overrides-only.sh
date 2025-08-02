#!/bin/bash

# Add Overrides Only Script
# This script only adds package overrides to fix warnings without updating versions

echo "🔧 Adding package overrides to fix build warnings..."

# Backup original package.json files
cp frontend/package.json frontend/package.json.backup
cp backend/package.json backend/package.json.backup
cp package.json package.json.backup

echo "✅ Backed up original package.json files"

# Add overrides to frontend package.json
echo "📦 Adding overrides to frontend/package.json..."

# Use Node.js to add overrides to frontend package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));

pkg.overrides = {
  ...pkg.overrides,
  'sourcemap-codec': 'npm:@jridgewell/sourcemap-codec@^1.5.0',
  '@jridgewell/sourcemap-codec': '^1.5.0',
  'magic-string': '^0.30.17',
  '@rollup/plugin-replace': '^6.0.1',
  'workbox-build': '^7.3.0',
  'workbox-webpack-plugin': '^7.3.0',
  'ajv': '^8.17.1',
  'ajv-keywords': '^5.1.0'
};

pkg.resolutions = {
  ...pkg.resolutions,
  'sourcemap-codec': 'npm:@jridgewell/sourcemap-codec@^1.5.0',
  '@jridgewell/sourcemap-codec': '^1.5.0',
  'magic-string': '^0.30.17',
  '@rollup/plugin-replace': '^6.0.1',
  'workbox-build': '^7.3.0',
  'workbox-webpack-plugin': '^7.3.0',
  'ajv': '^8.17.1',
  'ajv-keywords': '^5.1.0'
};

fs.writeFileSync('frontend/package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Added overrides to frontend/package.json');
"

# Add overrides to backend package.json
echo "📦 Adding overrides to backend/package.json..."

node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));

pkg.overrides = {
  ...pkg.overrides,
  'sourcemap-codec': 'npm:@jridgewell/sourcemap-codec@^1.5.0',
  '@jridgewell/sourcemap-codec': '^1.5.0',
  'ajv': '^8.17.1',
  'ajv-keywords': '^5.1.0'
};

pkg.resolutions = {
  ...pkg.resolutions,
  'sourcemap-codec': 'npm:@jridgewell/sourcemap-codec@^1.5.0',
  '@jridgewell/sourcemap-codec': '^1.5.0',
  'ajv': '^8.17.1',
  'ajv-keywords': '^5.1.0'
};

fs.writeFileSync('backend/package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Added overrides to backend/package.json');
"

# Add overrides to root package.json
echo "📦 Adding overrides to root package.json..."

node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.overrides = {
  ...pkg.overrides,
  'sourcemap-codec': 'npm:@jridgewell/sourcemap-codec@^1.5.0',
  '@jridgewell/sourcemap-codec': '^1.5.0',
  'ajv': '^8.17.1',
  'ajv-keywords': '^5.1.0'
};

pkg.resolutions = {
  ...pkg.resolutions,
  'sourcemap-codec': 'npm:@jridgewell/sourcemap-codec@^1.5.0',
  '@jridgewell/sourcemap-codec': '^1.5.0',
  'ajv': '^8.17.1',
  'ajv-keywords': '^5.1.0'
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Added overrides to root package.json');
"

echo ""
echo "🎉 Package overrides added successfully!"
echo ""
echo "📋 What was changed:"
echo "  • Added overrides to replace sourcemap-codec with @jridgewell/sourcemap-codec"
echo "  • Added overrides for workbox packages to use latest versions"
echo "  • Added overrides for ajv packages to fix validation warnings"
echo "  • Added both 'overrides' and 'resolutions' for maximum compatibility"
echo ""
echo "🚀 Next steps:"
echo "  1. Delete node_modules: rm -rf frontend/node_modules backend/node_modules"
echo "  2. Reinstall dependencies: cd frontend && npm install --legacy-peer-deps"
echo "  3. Test build: npm run build"
echo ""
echo "🔄 To revert changes:"
echo "  • Restore from backups: cp frontend/package.json.backup frontend/package.json"
echo "  • Restore from backups: cp backend/package.json.backup backend/package.json"
echo "  • Restore from backups: cp package.json.backup package.json"
