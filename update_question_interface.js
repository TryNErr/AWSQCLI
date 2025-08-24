#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the current types.ts file
const typesFilePath = path.join(__dirname, 'testace-app/frontend/src/types.ts');
let typesContent = fs.readFileSync(typesFilePath, 'utf8');

// Find the Question interface and add the passage field
const oldInterface = `export interface Question {
  _id: string;
  content: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  solution?: string;
  difficulty: DifficultyLevel;
  subject: string;
  grade: string;
  type: QuestionType;
  topic?: string;
  tags?: string[];
  hints?: string[];
  timeLimit?: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isGenerated?: boolean;
  generatedAt?: Date;
  generationMethod?: string;
}`;

const newInterface = `export interface Question {
  _id: string;
  content: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  solution?: string;
  difficulty: DifficultyLevel;
  subject: string;
  grade: string;
  type: QuestionType;
  topic?: string;
  tags?: string[];
  hints?: string[];
  timeLimit?: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isGenerated?: boolean;
  generatedAt?: Date;
  generationMethod?: string;
  passage?: string; // For reading comprehension questions
  _cacheBreaker?: string; // For cache invalidation
}`;

// Replace the old interface with the new one
if (typesContent.includes(oldInterface)) {
  typesContent = typesContent.replace(oldInterface, newInterface);
  
  // Write the updated content back to the file
  fs.writeFileSync(typesFilePath, typesContent);
  console.log('✅ Successfully updated Question interface in types.ts!');
  console.log('📖 Added passage?: string field for reading comprehension questions');
  console.log('🔧 Added _cacheBreaker?: string field for cache management');
} else {
  console.log('❌ Could not find the exact Question interface to update.');
  console.log('🔍 Please manually add passage?: string to the Question interface.');
}

console.log('\n🎯 TYPESCRIPT TYPES UPDATED:');
console.log('• passage?: string - Optional field for reading passages');
console.log('• _cacheBreaker?: string - Optional field for cache invalidation');
console.log('\n✅ TypeScript will now recognize the passage field!');
