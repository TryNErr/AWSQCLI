#!/usr/bin/env node

/**
 * Comprehensive Subject Filtering Bug Diagnostic
 * 
 * The user STILL gets wrong subjects despite all our fixes:
 * - Selected: Grade 9 Hard Reading
 * - Got: Grade 9 Medium English (Parts of Speech)
 * 
 * This diagnostic will trace the entire flow to find the remaining issue.
 */

const fs = require('fs');
const path = require('path');

function comprehensiveDiagnostic() {
  console.log('🔍 COMPREHENSIVE SUBJECT FILTERING BUG DIAGNOSTIC');
  console.log('=================================================\n');
  
  console.log('🚨 PERSISTENT ISSUE:');
  console.log('User selects: Grade 9 Hard Reading');
  console.log('System shows: Grade 9 Medium English (Parts of Speech)');
  console.log('This should NOT happen after all our fixes!\n');
  
  // 1. Check all components that might load questions
  console.log('📋 COMPONENT ANALYSIS:');
  console.log('======================');
  
  const questionComponents = [
    './testace-app/frontend/src/pages/Practice/Question.tsx',
    './testace-app/frontend/src/pages/Practice/PracticeSession.tsx',
    './testace-app/frontend/src/pages/Practice/EnhancedQuestion.tsx',
    './testace-app/frontend/src/pages/Practice/EnhancedPractice.tsx'
  ];
  
  questionComponents.forEach(componentPath => {
    if (fs.existsSync(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8');
      
      console.log(`\\n📄 ${path.basename(componentPath)}:`);
      
      // Check what question loading method it uses
      const usesStaticLoader = content.includes('StaticQuestionLoader');
      const usesEnhancedMaintenance = content.includes('getQuestionsForPractice') || content.includes('enhancedQuestionMaintenance');
      const usesOldQuestionData = content.includes('questionData') && !content.includes('StaticQuestionLoader');
      const usesGeneration = content.includes('generateEnhanced') || content.includes('generateMath') || content.includes('generateEnglish');
      
      console.log(`   Uses StaticQuestionLoader: ${usesStaticLoader ? '✅ YES' : '❌ NO'}`);
      console.log(`   Uses enhancedQuestionMaintenance: ${usesEnhancedMaintenance ? '❌ YES (problematic)' : '✅ NO'}`);
      console.log(`   Uses old questionData: ${usesOldQuestionData ? '❌ YES (problematic)' : '✅ NO'}`);
      console.log(`   Uses question generation: ${usesGeneration ? '⚠️ YES (might be problematic)' : '✅ NO'}`);
      
      // Check for specific problematic patterns
      if (content.includes('Parts of Speech')) {
        console.log(`   🚨 CONTAINS "Parts of Speech" - This might be the source!`);
      }
      
      if (content.includes('enhancedLanguageGenerator')) {
        console.log(`   🚨 USES enhancedLanguageGenerator - This generates English questions!`);
      }
      
    } else {
      console.log(`\\n📄 ${path.basename(componentPath)}: ❌ NOT FOUND`);
    }
  });
  
  // 2. Check routing
  console.log('\\n🛣️ ROUTING ANALYSIS:');
  console.log('====================');
  
  const appPath = './testace-app/frontend/src/App.tsx';
  if (fs.existsSync(appPath)) {
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    // Find practice-related routes
    const lines = appContent.split('\\n');
    lines.forEach((line, index) => {
      if (line.includes('/practice') && line.includes('Route')) {
        console.log(`   Line ${index + 1}: ${line.trim()}`);
      }
    });
  }
  
  // 3. Check for caching or localStorage issues
  console.log('\\n💾 POTENTIAL CACHING ISSUES:');
  console.log('=============================');
  
  const cachingFiles = [
    './testace-app/frontend/src/services/generatedQuestionsService.ts',
    './testace-app/frontend/src/utils/staticQuestionLoader.ts'
  ];
  
  cachingFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`\\n📄 ${path.basename(filePath)}:`);
      
      if (content.includes('localStorage')) {
        console.log('   ⚠️ Uses localStorage - might have cached wrong questions');
      }
      
      if (content.includes('cache')) {
        console.log('   ⚠️ Has caching logic - might be serving stale data');
      }
    }
  });
  
  // 4. Check what's actually in the static files
  console.log('\\n📁 STATIC FILE VERIFICATION:');
  console.log('=============================');
  
  const readingFile = './testace-app/frontend/public/questions/9_hard_reading.json';
  const englishFile = './testace-app/frontend/public/questions/9_medium_english.json';
  
  if (fs.existsSync(readingFile)) {
    const readingQuestions = JSON.parse(fs.readFileSync(readingFile, 'utf8'));
    console.log(`\\n📚 9_hard_reading.json:`);
    console.log(`   Questions: ${readingQuestions.length}`);
    console.log(`   First question: "${readingQuestions[0]?.content?.substring(0, 50)}..."`);
    console.log(`   Subject: ${readingQuestions[0]?.subject}`);
  }
  
  if (fs.existsSync(englishFile)) {
    const englishQuestions = JSON.parse(fs.readFileSync(englishFile, 'utf8'));
    console.log(`\\n📝 9_medium_english.json:`);
    console.log(`   Questions: ${englishQuestions.length}`);
    
    // Look for Parts of Speech questions
    const partsOfSpeechQuestion = englishQuestions.find(q => 
      q.content?.includes('part of speech') || q.content?.includes('Parts of Speech')
    );
    
    if (partsOfSpeechQuestion) {
      console.log(`   🚨 FOUND Parts of Speech question: "${partsOfSpeechQuestion.content?.substring(0, 50)}..."`);
    } else {
      console.log(`   ✅ No Parts of Speech questions found in static file`);
    }
  }
  
  // 5. Check for question generation that might be overriding
  console.log('\\n🏭 QUESTION GENERATION ANALYSIS:');
  console.log('=================================');
  
  const generatorFiles = [
    './testace-app/frontend/src/utils/enhancedLanguageGenerator.ts',
    './testace-app/frontend/src/utils/enhancedEnglishQuestionGenerator.ts',
    './testace-app/frontend/src/utils/englishQuestionGenerator.ts'
  ];
  
  generatorFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`\\n📄 ${path.basename(filePath)}:`);
      
      if (content.includes('Parts of Speech')) {
        console.log('   🚨 GENERATES "Parts of Speech" questions!');
      }
      
      if (content.includes('running') && content.includes('exercise')) {
        console.log('   🚨 GENERATES the exact question user is seeing!');
      }
    }
  });
  
  console.log('\\n🎯 DIAGNOSTIC SUMMARY:');
  console.log('======================');
  console.log('1. Check which components still use old generation systems');
  console.log('2. Verify routing is correct');
  console.log('3. Clear any cached questions');
  console.log('4. Ensure StaticQuestionLoader is used everywhere');
  console.log('5. Find and eliminate question generators that override static files');
}

if (require.main === module) {
  comprehensiveDiagnostic();
}
