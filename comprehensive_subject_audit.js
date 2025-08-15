#!/usr/bin/env node

/**
 * Comprehensive Subject-Appropriate Question Audit
 * 
 * This will systematically examine ALL subjects (Math, English, Reading, Thinking Skills)
 * across ALL grades (1-12) and ALL difficulties (easy, medium, hard) to ensure:
 * 1. Questions match the grade level
 * 2. Questions match the difficulty level
 * 3. No inappropriate content for the grade/difficulty
 * 4. True educational progression from grade 1 to 12
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

// Define what's appropriate for each subject/grade/difficulty combination
const SUBJECT_STANDARDS = {
  math: {
    // Elementary (Grades 1-5)
    elementary: {
      easy: {
        appropriate: ['basic addition (1-20)', 'basic subtraction (1-20)', 'counting', 'simple shapes', 'time telling'],
        inappropriate: ['algebra', 'calculus', 'trigonometry', 'complex numbers', 'derivatives', 'logarithms']
      },
      medium: {
        appropriate: ['addition/subtraction (1-100)', 'basic multiplication tables', 'simple fractions', 'basic geometry'],
        inappropriate: ['quadratic equations', 'systems of equations', 'advanced geometry', 'calculus']
      },
      hard: {
        appropriate: ['multiplication/division', 'fractions', 'decimals', 'word problems', 'basic measurement'],
        inappropriate: ['algebra beyond simple equations', 'trigonometry', 'calculus', 'matrices']
      }
    },
    // Middle School (Grades 6-8)
    middle: {
      easy: {
        appropriate: ['basic algebra', 'simple equations', 'ratios', 'proportions', 'basic geometry'],
        inappropriate: ['calculus', 'trigonometry', 'complex numbers', 'advanced functions']
      },
      medium: {
        appropriate: ['linear equations', 'basic quadratics', 'geometry formulas', 'statistics basics'],
        inappropriate: ['calculus', 'advanced trigonometry', 'logarithms', 'matrices']
      },
      hard: {
        appropriate: ['systems of equations', 'quadratic equations', 'advanced geometry', 'basic trigonometry'],
        inappropriate: ['calculus', 'complex numbers', 'advanced statistics', 'differential equations']
      }
    },
    // High School (Grades 9-12)
    high: {
      easy: {
        appropriate: ['linear equations', 'basic quadratics', 'simple functions', 'basic trigonometry'],
        inappropriate: ['elementary arithmetic (1×1, 2+3)', 'basic counting', 'simple addition']
      },
      medium: {
        appropriate: ['quadratic equations', 'polynomial functions', 'trigonometric functions', 'logarithms'],
        inappropriate: ['basic arithmetic', 'elementary geometry', 'simple counting']
      },
      hard: {
        appropriate: ['calculus', 'advanced trigonometry', 'complex numbers', 'matrices', 'advanced functions', 'limits', 'derivatives'],
        inappropriate: ['basic arithmetic', 'elementary operations', 'simple multiplication tables']
      }
    }
  },
  
  english: {
    elementary: {
      easy: {
        appropriate: ['basic phonics', 'simple vocabulary', 'basic punctuation', 'simple sentences'],
        inappropriate: ['advanced grammar', 'literary analysis', 'complex syntax', 'advanced vocabulary']
      },
      medium: {
        appropriate: ['parts of speech', 'simple grammar rules', 'basic reading comprehension', 'spelling'],
        inappropriate: ['literary devices', 'complex grammar', 'essay analysis', 'advanced rhetoric']
      },
      hard: {
        appropriate: ['compound sentences', 'basic writing skills', 'intermediate vocabulary', 'simple stories'],
        inappropriate: ['literary criticism', 'advanced composition', 'complex literary devices', 'rhetorical analysis']
      }
    },
    middle: {
      easy: {
        appropriate: ['grammar rules', 'vocabulary building', 'basic writing', 'simple literary devices'],
        inappropriate: ['advanced literary analysis', 'complex rhetoric', 'advanced composition techniques']
      },
      medium: {
        appropriate: ['literary devices', 'essay writing', 'grammar complexity', 'reading comprehension'],
        inappropriate: ['advanced literary criticism', 'complex rhetorical analysis', 'university-level writing']
      },
      hard: {
        appropriate: ['advanced grammar', 'literary analysis', 'complex writing', 'rhetoric basics'],
        inappropriate: ['graduate-level analysis', 'advanced linguistic theory', 'complex philosophical texts']
      }
    },
    high: {
      easy: {
        appropriate: ['intermediate grammar', 'basic literary analysis', 'essay structure', 'vocabulary expansion'],
        inappropriate: ['basic phonics', 'simple spelling', 'elementary punctuation']
      },
      medium: {
        appropriate: ['literary devices', 'advanced grammar', 'analytical writing', 'text analysis'],
        inappropriate: ['basic sentence structure', 'elementary vocabulary', 'simple punctuation']
      },
      hard: {
        appropriate: ['advanced literary analysis', 'complex grammar', 'rhetorical analysis', 'advanced composition', 'critical thinking'],
        inappropriate: ['basic spelling', 'simple sentence structure', 'elementary vocabulary']
      }
    }
  },
  
  reading: {
    elementary: {
      easy: {
        appropriate: ['simple stories', 'basic comprehension', 'main idea identification', 'character recognition'],
        inappropriate: ['complex literary analysis', 'advanced inference', 'critical analysis', 'abstract themes']
      },
      medium: {
        appropriate: ['story comprehension', 'basic inference', 'sequence understanding', 'simple themes'],
        inappropriate: ['literary criticism', 'complex symbolism', 'advanced analysis', 'abstract concepts']
      },
      hard: {
        appropriate: ['detailed comprehension', 'character analysis', 'plot understanding', 'basic themes'],
        inappropriate: ['advanced literary theory', 'complex symbolism', 'philosophical analysis']
      }
    },
    middle: {
      easy: {
        appropriate: ['story analysis', 'character development', 'theme identification', 'basic inference'],
        inappropriate: ['advanced literary criticism', 'complex philosophical texts', 'graduate-level analysis']
      },
      medium: {
        appropriate: ['literary devices in text', 'advanced inference', 'text analysis', 'author purpose'],
        inappropriate: ['complex literary theory', 'advanced philosophical analysis', 'university-level criticism']
      },
      hard: {
        appropriate: ['complex text analysis', 'advanced themes', 'literary device analysis', 'critical reading'],
        inappropriate: ['graduate-level literary theory', 'complex philosophical treatises']
      }
    },
    high: {
      easy: {
        appropriate: ['text analysis', 'theme exploration', 'character analysis', 'basic literary criticism'],
        inappropriate: ['simple story comprehension', 'basic main idea', 'elementary inference']
      },
      medium: {
        appropriate: ['literary analysis', 'advanced inference', 'text criticism', 'author analysis'],
        inappropriate: ['basic comprehension', 'simple story elements', 'elementary themes']
      },
      hard: {
        appropriate: ['advanced literary criticism', 'complex text analysis', 'philosophical reading', 'critical analysis'],
        inappropriate: ['basic story comprehension', 'simple main idea identification', 'elementary inference']
      }
    }
  },
  
  'thinking-skills': {
    elementary: {
      easy: {
        appropriate: ['simple patterns', 'basic logic', 'sorting', 'simple problem solving'],
        inappropriate: ['complex logic puzzles', 'advanced reasoning', 'abstract thinking', 'complex analysis']
      },
      medium: {
        appropriate: ['pattern recognition', 'basic reasoning', 'simple puzzles', 'logical thinking'],
        inappropriate: ['advanced logic', 'complex problem solving', 'abstract reasoning', 'philosophical logic']
      },
      hard: {
        appropriate: ['complex patterns', 'multi-step reasoning', 'problem solving', 'logical deduction'],
        inappropriate: ['advanced philosophical reasoning', 'complex abstract thinking', 'graduate-level logic']
      }
    },
    middle: {
      easy: {
        appropriate: ['logical reasoning', 'pattern analysis', 'problem solving strategies', 'basic critical thinking'],
        inappropriate: ['advanced philosophical logic', 'complex abstract reasoning', 'university-level analysis']
      },
      medium: {
        appropriate: ['complex problem solving', 'advanced patterns', 'logical analysis', 'critical thinking'],
        inappropriate: ['graduate-level logic', 'complex philosophical reasoning', 'advanced abstract thinking']
      },
      hard: {
        appropriate: ['advanced logic puzzles', 'complex reasoning', 'analytical thinking', 'strategic problem solving'],
        inappropriate: ['graduate-level philosophical logic', 'complex mathematical proofs', 'advanced theoretical reasoning']
      }
    },
    high: {
      easy: {
        appropriate: ['analytical thinking', 'logical problem solving', 'pattern analysis', 'basic reasoning'],
        inappropriate: ['simple sorting', 'basic counting patterns', 'elementary logic']
      },
      medium: {
        appropriate: ['complex problem solving', 'advanced reasoning', 'analytical skills', 'critical thinking'],
        inappropriate: ['simple pattern recognition', 'basic logic puzzles', 'elementary reasoning']
      },
      hard: {
        appropriate: ['advanced analytical thinking', 'complex logic', 'strategic reasoning', 'abstract problem solving'],
        inappropriate: ['simple patterns', 'basic logic', 'elementary problem solving']
      }
    }
  }
};

function getGradeCategory(grade) {
  const gradeNum = parseInt(grade);
  if (gradeNum <= 5) return 'elementary';
  if (gradeNum <= 8) return 'middle';
  return 'high';
}

function analyzeQuestionAppropriatenessForSubject(subject) {
  console.log(`\n📚 ANALYZING ${subject.toUpperCase()} QUESTIONS`);
  console.log('='.repeat(50));
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  const subjectFiles = files.filter(f => f.includes(`_${subject}.json`) && f !== 'manifest.json');
  
  const inappropriateFiles = [];
  
  subjectFiles.forEach(file => {
    const [grade, difficulty] = file.split('_');
    const gradeNum = parseInt(grade);
    const gradeCategory = getGradeCategory(grade);
    
    console.log(`\n🔍 Analyzing ${file}...`);
    
    try {
      const questions = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8'));
      const inappropriateQuestions = [];
      
      questions.forEach((question, index) => {
        const content = question.content.toLowerCase();
        const issues = analyzeQuestionContent(content, subject, gradeCategory, difficulty, gradeNum);
        
        if (issues.length > 0) {
          inappropriateQuestions.push({
            index,
            content: question.content.substring(0, 60) + '...',
            issues
          });
        }
      });
      
      if (inappropriateQuestions.length > 0) {
        inappropriateFiles.push({
          file,
          grade: gradeNum,
          difficulty,
          gradeCategory,
          totalQuestions: questions.length,
          inappropriateCount: inappropriateQuestions.length,
          examples: inappropriateQuestions.slice(0, 3)
        });
        
        console.log(`   ❌ Found ${inappropriateQuestions.length} inappropriate questions:`);
        inappropriateQuestions.slice(0, 3).forEach(q => {
          console.log(`      "${q.content}" - Issues: ${q.issues.join(', ')}`);
        });
      } else {
        console.log(`   ✅ All questions appear appropriate for Grade ${grade} ${difficulty}`);
      }
      
    } catch (error) {
      console.log(`   ⚠️ Error reading ${file}: ${error.message}`);
    }
  });
  
  return inappropriateFiles;
}

function analyzeQuestionContent(content, subject, gradeCategory, difficulty, gradeNum) {
  const issues = [];
  
  if (subject === 'math') {
    // Check for grade-inappropriate math content
    if (gradeCategory === 'high' && difficulty === 'hard') {
      // Grade 9-12 hard should not have basic arithmetic
      if (content.includes('what is') && content.match(/\d+\s*[+\-×÷]\s*\d+/) && 
          !content.includes('matrix') && !content.includes('complex') && !content.includes('derivative')) {
        const numbers = content.match(/\d+/g);
        if (numbers && numbers.every(num => parseInt(num) <= 12)) {
          issues.push('basic_arithmetic_too_elementary');
        }
      }
      
      // Should have advanced topics
      if (!content.includes('derivative') && !content.includes('log') && !content.includes('sin') && 
          !content.includes('cos') && !content.includes('matrix') && !content.includes('complex') &&
          !content.includes('limit') && !content.includes('integral') && content.includes('what is')) {
        issues.push('missing_advanced_topics');
      }
    }
    
    if (gradeCategory === 'elementary' && (content.includes('derivative') || content.includes('calculus') || 
        content.includes('logarithm') || content.includes('trigonometry'))) {
      issues.push('too_advanced_for_elementary');
    }
    
    if (gradeNum >= 6 && content.includes('what is 1 × 1')) {
      issues.push('trivial_for_grade_level');
    }
  }
  
  if (subject === 'english') {
    if (gradeCategory === 'high' && difficulty === 'hard') {
      // Should have advanced grammar, literary analysis, etc.
      if (content.includes('which word is a noun') || content.includes('past tense of') ||
          content.includes('correct spelling')) {
        issues.push('too_elementary_for_high_school_hard');
      }
      
      // Should have advanced concepts
      if (!content.includes('literary') && !content.includes('rhetoric') && !content.includes('analysis') &&
          !content.includes('subjunctive') && !content.includes('gerund') && !content.includes('clause') &&
          content.includes('which word')) {
        issues.push('missing_advanced_grammar_concepts');
      }
    }
    
    if (gradeCategory === 'elementary' && (content.includes('subjunctive') || content.includes('gerund') ||
        content.includes('literary device') || content.includes('rhetoric'))) {
      issues.push('too_advanced_for_elementary');
    }
    
    if (gradeNum >= 9 && (content.includes('what is the first letter') || 
        content.includes('which word is a noun') && !content.includes('sentence'))) {
      issues.push('too_basic_for_high_school');
    }
  }
  
  if (subject === 'reading') {
    if (gradeCategory === 'high' && difficulty === 'hard') {
      // Should have complex analysis
      if (content.includes('main idea') && !content.includes('complex') && !content.includes('analysis')) {
        issues.push('too_simple_for_high_school_hard');
      }
      
      // Should have advanced reading skills
      if (!content.includes('analysis') && !content.includes('inference') && !content.includes('author') &&
          !content.includes('purpose') && !content.includes('theme') && content.includes('read this')) {
        issues.push('missing_advanced_reading_skills');
      }
    }
    
    if (gradeCategory === 'elementary' && (content.includes('literary criticism') || 
        content.includes('rhetorical analysis') || content.includes('complex symbolism'))) {
      issues.push('too_advanced_for_elementary');
    }
  }
  
  if (subject === 'thinking-skills') {
    if (gradeCategory === 'high' && difficulty === 'hard') {
      // Should have complex reasoning
      if (content.includes('complete the pattern') && content.match(/\d+,\s*\d+,\s*\d+/)) {
        issues.push('too_simple_pattern_for_high_school_hard');
      }
      
      // Should have advanced logic
      if (!content.includes('logic') && !content.includes('reasoning') && !content.includes('analysis') &&
          !content.includes('strategy') && !content.includes('complex') && content.includes('pattern')) {
        issues.push('missing_advanced_logical_reasoning');
      }
    }
    
    if (gradeCategory === 'elementary' && (content.includes('complex logic') || 
        content.includes('advanced reasoning') || content.includes('philosophical'))) {
      issues.push('too_advanced_for_elementary');
    }
    
    if (gradeNum >= 9 && content.includes('complete the pattern: 2, 4, 6')) {
      issues.push('too_elementary_for_high_school');
    }
  }
  
  return issues;
}

function main() {
  console.log('🚀 COMPREHENSIVE SUBJECT-APPROPRIATE QUESTION AUDIT');
  console.log('==================================================\n');
  
  console.log('This will analyze ALL subjects across ALL grades and difficulties to ensure:');
  console.log('✅ Questions match grade level (no "1×1" in Grade 12)');
  console.log('✅ Questions match difficulty level');
  console.log('✅ Educational progression from Grade 1 to 12');
  console.log('✅ Subject-appropriate content\n');
  
  const subjects = ['math', 'english', 'reading', 'thinking-skills'];
  const allInappropriateFiles = {};
  
  subjects.forEach(subject => {
    const inappropriateFiles = analyzeQuestionAppropriatenessForSubject(subject);
    allInappropriateFiles[subject] = inappropriateFiles;
  });
  
  // Summary report
  console.log('\n📊 COMPREHENSIVE AUDIT SUMMARY');
  console.log('==============================\n');
  
  let totalInappropriate = 0;
  subjects.forEach(subject => {
    const inappropriate = allInappropriateFiles[subject];
    console.log(`${subject.toUpperCase()}:`);
    console.log(`   Files with issues: ${inappropriate.length}`);
    
    if (inappropriate.length > 0) {
      inappropriate.forEach(file => {
        console.log(`   ❌ ${file.file}: ${file.inappropriateCount}/${file.totalQuestions} questions need fixing`);
        totalInappropriate += file.inappropriateCount;
      });
    } else {
      console.log(`   ✅ All files appear appropriate`);
    }
    console.log('');
  });
  
  console.log(`🎯 TOTAL INAPPROPRIATE QUESTIONS IDENTIFIED: ${totalInappropriate}`);
  
  if (totalInappropriate > 0) {
    console.log('\n⚠️ ISSUES FOUND - COMPREHENSIVE FIX NEEDED');
    console.log('Next step: Run comprehensive fix for all subjects');
  } else {
    console.log('\n🏆 ALL SUBJECTS APPEAR GRADE AND DIFFICULTY APPROPRIATE!');
  }
  
  return allInappropriateFiles;
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeQuestionAppropriatenessForSubject,
  analyzeQuestionContent,
  SUBJECT_STANDARDS
};
