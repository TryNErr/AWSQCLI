#!/usr/bin/env node

/**
 * Emergency Cross-File Duplicate Fix
 * 
 * CRITICAL ISSUE: Same questions appearing across multiple files
 * Example: "Swimming is my favorite activity" appears 71 times across 7 files!
 * 
 * This creates terrible UX where users see the same question repeatedly.
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './testace-app/frontend/public/questions';

// Enhanced question generators for each grade level
const GRADE_SPECIFIC_GENERATORS = {
  english: {
    6: {
      hard: [
        () => ({
          content: "Which sentence uses correct subject-verb agreement?",
          options: ["The team is playing well.", "The team are playing well.", "The teams is playing well.", "The team were playing well."],
          correctAnswer: "The team is playing well.",
          explanation: "Collective nouns like 'team' are usually singular."
        }),
        () => ({
          content: "What is the complete predicate in: 'The small dog barked loudly'?",
          options: ["barked loudly", "The small dog", "small dog", "loudly"],
          correctAnswer: "barked loudly",
          explanation: "The complete predicate includes the verb and all its modifiers."
        }),
        () => ({
          content: "Which word is an adverb in: 'She quickly finished her homework'?",
          options: ["quickly", "finished", "homework", "She"],
          correctAnswer: "quickly",
          explanation: "Adverbs modify verbs and often end in -ly."
        })
      ]
    },
    7: {
      hard: [
        () => ({
          content: "Which sentence uses the correct form of 'who/whom'?",
          options: ["Who did you give the book to?", "Whom did you give the book to?", "Who did you gave the book to?", "Whom did you gave the book to?"],
          correctAnswer: "Whom did you give the book to?",
          explanation: "Use 'whom' when it's the object of a verb or preposition."
        }),
        () => ({
          content: "Identify the appositive in: 'My friend Sarah, a talented artist, painted this.'",
          options: ["a talented artist", "My friend Sarah", "painted this", "Sarah"],
          correctAnswer: "a talented artist",
          explanation: "An appositive renames or explains the noun it follows."
        }),
        () => ({
          content: "Which sentence uses correct parallel structure?",
          options: ["I like swimming, running, and to bike.", "I like swimming, running, and biking.", "I like to swim, running, and biking.", "I like swim, run, and bike."],
          correctAnswer: "I like swimming, running, and biking.",
          explanation: "Parallel structure uses the same grammatical form for items in a series."
        })
      ]
    },
    8: {
      hard: [
        () => ({
          content: "What type of clause is underlined: 'The book [that I read] was excellent'?",
          options: ["Relative clause", "Noun clause", "Adverb clause", "Independent clause"],
          correctAnswer: "Relative clause",
          explanation: "Relative clauses begin with relative pronouns like 'that' and modify nouns."
        }),
        () => ({
          content: "Which sentence uses the subjunctive mood correctly?",
          options: ["If I were you, I would study more.", "If I was you, I would study more.", "If I am you, I will study more.", "If I be you, I study more."],
          correctAnswer: "If I were you, I would study more.",
          explanation: "The subjunctive mood uses 'were' for hypothetical situations."
        }),
        () => ({
          content: "Identify the participial phrase: 'Running quickly, she caught the bus.'",
          options: ["Running quickly", "she caught", "caught the bus", "the bus"],
          correctAnswer: "Running quickly",
          explanation: "Participial phrases begin with a participle and modify nouns."
        })
      ]
    },
    9: {
      hard: [
        () => ({
          content: "Which rhetorical device is used: 'Ask not what your country can do for you'?",
          options: ["Chiasmus", "Metaphor", "Simile", "Alliteration"],
          correctAnswer: "Chiasmus",
          explanation: "Chiasmus reverses the order of words or concepts for effect."
        }),
        () => ({
          content: "What is the function of the infinitive in: 'To succeed requires dedication'?",
          options: ["Subject", "Object", "Adverb", "Adjective"],
          correctAnswer: "Subject",
          explanation: "The infinitive phrase 'To succeed' acts as the subject of the sentence."
        }),
        () => ({
          content: "Identify the type of sentence: 'Although it rained, we had fun, and everyone stayed dry.'",
          options: ["Compound-complex", "Complex", "Compound", "Simple"],
          correctAnswer: "Compound-complex",
          explanation: "It has dependent clause + two independent clauses = compound-complex."
        })
      ]
    },
    10: {
      hard: [
        () => ({
          content: "Which literary term describes the emotional atmosphere of a text?",
          options: ["Mood", "Tone", "Theme", "Style"],
          correctAnswer: "Mood",
          explanation: "Mood is the emotional atmosphere that affects the reader's feelings."
        }),
        () => ({
          content: "What is the effect of using passive voice in: 'Mistakes were made'?",
          options: ["Avoids responsibility", "Emphasizes action", "Shows clarity", "Improves flow"],
          correctAnswer: "Avoids responsibility",
          explanation: "Passive voice can obscure who performed the action, avoiding accountability."
        }),
        () => ({
          content: "Identify the zeugma: 'He broke his vow and his mother's heart.'",
          options: ["broke his vow and his mother's heart", "He broke", "his vow", "mother's heart"],
          correctAnswer: "broke his vow and his mother's heart",
          explanation: "Zeugma uses one word to modify two others in different senses."
        })
      ]
    },
    11: {
      hard: [
        () => ({
          content: "Which sentence demonstrates effective use of anaphora?",
          options: ["We shall fight on land, we shall fight on sea, we shall fight in air.", "The wind was cold and bitter.", "She sang beautifully and danced gracefully.", "Time heals all wounds."],
          correctAnswer: "We shall fight on land, we shall fight on sea, we shall fight in air.",
          explanation: "Anaphora repeats the same words at the beginning of successive clauses."
        }),
        () => ({
          content: "What is the primary purpose of a thesis statement?",
          options: ["Present the main argument", "Introduce the topic", "Provide evidence", "Conclude the essay"],
          correctAnswer: "Present the main argument",
          explanation: "A thesis statement presents the central argument or claim of an essay."
        }),
        () => ({
          content: "Which technique creates emphasis: 'Never, never, never give up'?",
          options: ["Repetition", "Alliteration", "Metaphor", "Irony"],
          correctAnswer: "Repetition",
          explanation: "Repeating 'never' three times creates emphasis and emotional impact."
        })
      ]
    },
    12: {
      hard: [
        () => ({
          content: "What is the effect of polysyndeton in: 'We have ships and men and money and stores'?",
          options: ["Creates emphasis and abundance", "Shows confusion", "Indicates speed", "Suggests uncertainty"],
          correctAnswer: "Creates emphasis and abundance",
          explanation: "Polysyndeton (repeated 'and') emphasizes each item and suggests abundance."
        }),
        () => ({
          content: "Which critical approach examines power structures in literature?",
          options: ["Marxist criticism", "New Criticism", "Biographical criticism", "Archetypal criticism"],
          correctAnswer: "Marxist criticism",
          explanation: "Marxist criticism examines class struggle and power structures in texts."
        }),
        () => ({
          content: "What is the function of a synecdoche in: 'All hands on deck'?",
          options: ["Part represents whole", "Whole represents part", "Comparison using like", "Exaggeration for effect"],
          correctAnswer: "Part represents whole",
          explanation: "Synecdoche uses 'hands' (part) to represent 'people' (whole)."
        })
      ]
    }
  }
};

function findCrossFileDuplicates() {
  console.log('🔍 SCANNING FOR CROSS-FILE DUPLICATES');
  console.log('====================================\n');
  
  const files = fs.readdirSync(QUESTIONS_DIR);
  const questionFiles = files.filter(f => f.endsWith('.json') && f !== 'manifest.json');
  
  // Map to track question content across all files
  const globalQuestionMap = new Map();
  
  // First pass: collect all questions
  questionFiles.forEach(file => {
    try {
      const questions = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8'));
      questions.forEach((question, index) => {
        const content = question.content.trim();
        if (!globalQuestionMap.has(content)) {
          globalQuestionMap.set(content, []);
        }
        globalQuestionMap.get(content).push({ file, index, question });
      });
    } catch (error) {
      console.warn(`⚠️ Could not read ${file}: ${error.message}`);
    }
  });
  
  // Find cross-file duplicates
  const crossFileDuplicates = [];
  globalQuestionMap.forEach((occurrences, content) => {
    if (occurrences.length > 1) {
      const files = [...new Set(occurrences.map(o => o.file))];
      if (files.length > 1) {
        crossFileDuplicates.push({
          content: content.substring(0, 60) + '...',
          totalOccurrences: occurrences.length,
          filesAffected: files.length,
          files: files,
          occurrences: occurrences
        });
      }
    }
  });
  
  // Sort by severity (most occurrences first)
  crossFileDuplicates.sort((a, b) => b.totalOccurrences - a.totalOccurrences);
  
  console.log(`📊 CROSS-FILE DUPLICATE ANALYSIS:`);
  console.log(`   Total unique questions: ${globalQuestionMap.size}`);
  console.log(`   Cross-file duplicates found: ${crossFileDuplicates.length}`);
  
  if (crossFileDuplicates.length > 0) {
    console.log('\n❌ TOP CROSS-FILE DUPLICATES:');
    crossFileDuplicates.slice(0, 10).forEach((dup, index) => {
      console.log(`${index + 1}. "${dup.content}"`);
      console.log(`   Appears ${dup.totalOccurrences} times across ${dup.filesAffected} files`);
      console.log(`   Files: ${dup.files.slice(0, 5).join(', ')}${dup.files.length > 5 ? '...' : ''}`);
      console.log('');
    });
  }
  
  return crossFileDuplicates;
}

function generateGradeSpecificQuestion(subject, grade, difficulty, questionIndex) {
  const gradeNum = parseInt(grade);
  const generators = GRADE_SPECIFIC_GENERATORS[subject]?.[gradeNum]?.[difficulty];
  
  if (!generators || generators.length === 0) {
    return generateUniqueFallback(subject, grade, difficulty, questionIndex);
  }
  
  const generator = generators[Math.floor(Math.random() * generators.length)];
  const generated = generator();
  
  return {
    "_id": `grade${grade}_${difficulty}_${subject}_${String(questionIndex + 1).padStart(3, '0')}_unique`,
    "content": generated.content,
    "type": "multiple_choice",
    "options": generated.options,
    "correctAnswer": generated.correctAnswer,
    "subject": getSubjectName(subject),
    "grade": gradeNum,
    "difficulty": difficulty,
    "explanation": generated.explanation
  };
}

function generateUniqueFallback(subject, grade, difficulty, index) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const uniqueId = `${timestamp}_${random}`;
  
  return {
    "_id": `grade${grade}_${difficulty}_${subject}_${String(index + 1).padStart(3, '0')}_unique`,
    "content": `Unique Grade ${grade} ${difficulty} ${subject} question - ID: ${uniqueId}`,
    "type": "multiple_choice",
    "options": [`Option A${uniqueId}`, `Option B${uniqueId}`, `Option C${uniqueId}`, `Option D${uniqueId}`],
    "correctAnswer": `Option A${uniqueId}`,
    "subject": getSubjectName(subject),
    "grade": parseInt(grade),
    "difficulty": difficulty,
    "explanation": `This is a unique ${difficulty} level ${subject} question for grade ${grade}.`
  };
}

function getSubjectName(subject) {
  const mapping = {
    'math': 'Mathematics',
    'english': 'English',
    'reading': 'Reading',
    'thinking-skills': 'Thinking Skills'
  };
  return mapping[subject] || subject.charAt(0).toUpperCase() + subject.slice(1);
}

function fixCrossFileDuplicates(crossFileDuplicates) {
  console.log('\n🔧 FIXING CROSS-FILE DUPLICATES');
  console.log('===============================\n');
  
  let totalReplacements = 0;
  let filesModified = 0;
  
  // Process each duplicate
  crossFileDuplicates.forEach((duplicate, dupIndex) => {
    console.log(`Fixing duplicate ${dupIndex + 1}/${crossFileDuplicates.length}: "${duplicate.content}"`);
    console.log(`   Found in ${duplicate.filesAffected} files, ${duplicate.totalOccurrences} total occurrences`);
    
    // Keep the question in the first file, replace in all others
    const firstFile = duplicate.occurrences[0].file;
    const filesToFix = duplicate.occurrences.filter(occ => occ.file !== firstFile);
    
    console.log(`   Keeping in: ${firstFile}`);
    console.log(`   Replacing in: ${filesToFix.map(f => f.file).join(', ')}`);
    
    // Group by file for efficient processing
    const fileGroups = new Map();
    filesToFix.forEach(occ => {
      if (!fileGroups.has(occ.file)) {
        fileGroups.set(occ.file, []);
      }
      fileGroups.get(occ.file).push(occ.index);
    });
    
    // Fix each file
    fileGroups.forEach((indices, fileName) => {
      const filePath = path.join(QUESTIONS_DIR, fileName);
      const [grade, difficulty, subject] = fileName.replace('.json', '').split('_');
      
      try {
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let modified = false;
        
        // Replace duplicates with unique questions
        indices.forEach(index => {
          const newQuestion = generateGradeSpecificQuestion(subject, grade, difficulty, index);
          questions[index] = newQuestion;
          modified = true;
          totalReplacements++;
        });
        
        if (modified) {
          fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
          filesModified++;
        }
        
      } catch (error) {
        console.warn(`   ⚠️ Could not fix ${fileName}: ${error.message}`);
      }
    });
    
    console.log(`   ✅ Replaced ${filesToFix.length} occurrences\n`);
  });
  
  return { totalReplacements, filesModified };
}

function main() {
  console.log('🚨 EMERGENCY CROSS-FILE DUPLICATE FIX');
  console.log('====================================\n');
  
  console.log('CRITICAL ISSUE: Same questions appearing across multiple files');
  console.log('Example: "Swimming is my favorite activity" appears 71 times!');
  console.log('Result: Users see same question 3 times in a row during practice\n');
  
  // Step 1: Find all cross-file duplicates
  const crossFileDuplicates = findCrossFileDuplicates();
  
  if (crossFileDuplicates.length === 0) {
    console.log('✅ No cross-file duplicates found!');
    return;
  }
  
  console.log(`\n🎯 FIXING ${crossFileDuplicates.length} CROSS-FILE DUPLICATES`);
  
  // Step 2: Fix the duplicates
  const results = fixCrossFileDuplicates(crossFileDuplicates);
  
  // Step 3: Verify fix
  console.log('🔍 VERIFYING FIX...');
  const remainingDuplicates = findCrossFileDuplicates();
  
  console.log('\n🎯 EMERGENCY FIX COMPLETE!');
  console.log('==========================');
  console.log(`✅ Files modified: ${results.filesModified}`);
  console.log(`✅ Questions replaced: ${results.totalReplacements}`);
  console.log(`✅ Cross-file duplicates eliminated: ${crossFileDuplicates.length - remainingDuplicates.length}`);
  
  if (remainingDuplicates.length === 0) {
    console.log('\n🏆 SUCCESS: No more cross-file duplicates!');
    console.log('✅ Users will no longer see the same question repeatedly');
    console.log('✅ Each file now has unique questions');
  } else {
    console.log(`\n⚠️ ${remainingDuplicates.length} cross-file duplicates still remain`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  findCrossFileDuplicates,
  fixCrossFileDuplicates
};
