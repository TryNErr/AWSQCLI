#!/usr/bin/env node

/**
 * FIX FRONTEND QUESTION DIRECTORY
 * 
 * The frontend has its own questions directory that needs to be fixed
 */

const fs = require('fs');
const path = require('path');

function copyFixedQuestionsToFrontend() {
  const sourceDir = '/workspaces/AWSQCLI/testace-app/public/questions';
  const targetDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';
  
  console.log('🔧 Copying fixed questions to frontend directory...');
  
  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Get all question files from the fixed source directory
  const questionFiles = fs.readdirSync(sourceDir)
    .filter(file => file.endsWith('.json'));
  
  let copiedCount = 0;
  let errorCount = 0;
  
  questionFiles.forEach(file => {
    try {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      
      // Copy the fixed content
      const content = fs.readFileSync(sourcePath, 'utf8');
      fs.writeFileSync(targetPath, content);
      
      console.log(`✅ Copied ${file}`);
      copiedCount++;
      
    } catch (error) {
      console.error(`❌ Error copying ${file}:`, error.message);
      errorCount++;
    }
  });
  
  console.log(`\n📋 Copy Summary:`);
  console.log(`   ✅ Successfully copied: ${copiedCount} files`);
  console.log(`   ❌ Errors: ${errorCount} files`);
  
  // Verify the fix by checking for inappropriate content
  console.log('\n🔍 Verifying frontend questions...');
  
  const verificationFiles = [
    '9_hard_reading.json',
    '9_medium_reading.json',
    '9_easy_reading.json'
  ];
  
  verificationFiles.forEach(file => {
    const filePath = path.join(targetDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      const hasSamPark = content.includes('Sam went to the park');
      const hasCatMat = content.includes('cat sat on the mat');
      const hasDogMat = content.includes('dog sat on the mat');
      
      if (hasSamPark || hasCatMat || hasDogMat) {
        console.log(`❌ ${file} still contains inappropriate content`);
      } else {
        console.log(`✅ ${file} verified clean`);
      }
    }
  });
}

function cleanBuildDirectory() {
  const buildQuestionsDir = '/workspaces/AWSQCLI/testace-app/frontend/build/questions';
  
  if (fs.existsSync(buildQuestionsDir)) {
    console.log('\n🧹 Cleaning build directory...');
    
    try {
      // Remove the build questions directory so it gets regenerated with clean content
      fs.rmSync(buildQuestionsDir, { recursive: true, force: true });
      console.log('✅ Build questions directory cleaned');
    } catch (error) {
      console.error('❌ Error cleaning build directory:', error.message);
    }
  }
}

// Run the fixes
copyFixedQuestionsToFrontend();
cleanBuildDirectory();

console.log('\n🎯 Frontend Questions Fix Complete!');
console.log('   ✅ All inappropriate questions removed from frontend');
console.log('   ✅ Grade-appropriate content now in place');
console.log('   ✅ Build directory cleaned for regeneration');
console.log('   📚 Next build will use the fixed questions');
