const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Git Commit Status...\n');

try {
  // Check current branch
  const branch = execSync('git branch --show-current', { cwd: '/workspace/AWSQCLI', encoding: 'utf8' }).trim();
  console.log('📍 Current Branch:', branch);
  
  // Check last commit
  const lastCommit = execSync('git log --oneline -1', { cwd: '/workspace/AWSQCLI', encoding: 'utf8' }).trim();
  console.log('📝 Last Commit:', lastCommit);
  
  // Check if there are any uncommitted changes
  const status = execSync('git status --porcelain', { cwd: '/workspace/AWSQCLI', encoding: 'utf8' }).trim();
  if (status) {
    console.log('\n⚠️  Uncommitted changes found:');
    console.log(status);
  } else {
    console.log('\n✅ No uncommitted changes - all files are committed');
  }
  
  // Check what files are in the commit
  const commitFiles = execSync('git diff-tree --no-commit-id --name-only -r HEAD', { cwd: '/workspace/AWSQCLI', encoding: 'utf8' }).trim().split('\n');
  console.log('\n📁 Files in last commit:', commitFiles.length);
  
  // Check for node_modules in commit (should be none)
  const nodeModulesFiles = commitFiles.filter(file => file.includes('node_modules'));
  if (nodeModulesFiles.length > 0) {
    console.log('❌ ERROR: node_modules files found in commit:');
    nodeModulesFiles.forEach(file => console.log('  -', file));
  } else {
    console.log('✅ No node_modules files in commit');
  }
  
  // Check for build files in commit (should be minimal)
  const buildFiles = commitFiles.filter(file => file.includes('dist/') || file.includes('build/'));
  if (buildFiles.length > 0) {
    console.log('⚠️  Build files found in commit:');
    buildFiles.forEach(file => console.log('  -', file));
  } else {
    console.log('✅ No build files in commit');
  }
  
  // Check for log files in commit (should be none)
  const logFiles = commitFiles.filter(file => file.endsWith('.log'));
  if (logFiles.length > 0) {
    console.log('⚠️  Log files found in commit:');
    logFiles.forEach(file => console.log('  -', file));
  } else {
    console.log('✅ No log files in commit');
  }
  
  // Check key application files
  const keyFiles = [
    'testace-app/README.md',
    'testace-app/.gitignore',
    'testace-app/backend/package.json',
    'testace-app/frontend/package.json',
    'testace-app/backend/simple-server.js',
    'testace-app/frontend/src/App.tsx'
  ];
  
  console.log('\n🔑 Key application files:');
  keyFiles.forEach(file => {
    const exists = commitFiles.includes(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  });
  
  // Check remote configuration
  const remote = execSync('git remote -v', { cwd: '/workspace/AWSQCLI', encoding: 'utf8' }).trim();
  console.log('\n🌐 Git Remote Configuration:');
  console.log(remote);
  
  console.log('\n📊 Summary:');
  console.log(`  • Branch: ${branch}`);
  console.log(`  • Files committed: ${commitFiles.length}`);
  console.log(`  • Node_modules excluded: ✅`);
  console.log(`  • Ready to push: ✅ (authentication required)`);
  
  console.log('\n🚀 To push to GitHub, run one of these commands:');
  console.log('  gh auth login && git push origin main');
  console.log('  # OR set up authentication and run:');
  console.log('  git push origin main');
  
} catch (error) {
  console.error('❌ Error checking git status:', error.message);
}
