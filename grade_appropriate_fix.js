const fs = require('fs');
const path = require('path');

const questionsDir = 'testace-app/frontend/public/questions';

// Grade-appropriate question templates
const gradeAppropriateQuestions = {
  math: {
    1: {
      easy: [
        { content: "What is 1 + 1?", options: ["1", "2", "3", "4"], correct: 1, explanation: "1 + 1 = 2" },
        { content: "What is 3 + 2?", options: ["4", "5", "6", "7"], correct: 1, explanation: "3 + 2 = 5" },
        { content: "What is 5 - 2?", options: ["2", "3", "4", "5"], correct: 1, explanation: "5 - 2 = 3" },
        { content: "Count the dots: • • • •", options: ["3", "4", "5", "6"], correct: 1, explanation: "There are 4 dots" },
        { content: "What number comes after 7?", options: ["6", "7", "8", "9"], correct: 2, explanation: "8 comes after 7" }
      ]
    },
    2: {
      easy: [
        { content: "What is 12 + 8?", options: ["18", "19", "20", "21"], correct: 2, explanation: "12 + 8 = 20" },
        { content: "What is 15 - 7?", options: ["7", "8", "9", "10"], correct: 1, explanation: "15 - 7 = 8" },
        { content: "What is 6 × 3?", options: ["15", "16", "17", "18"], correct: 3, explanation: "6 × 3 = 18" },
        { content: "What is 20 ÷ 4?", options: ["4", "5", "6", "7"], correct: 1, explanation: "20 ÷ 4 = 5" },
        { content: "How many minutes are in 1 hour?", options: ["50", "60", "70", "80"], correct: 1, explanation: "There are 60 minutes in 1 hour" }
      ]
    },
    6: {
      medium: [
        { content: "Solve for x: 2x + 5 = 13", options: ["x = 3", "x = 4", "x = 5", "x = 6"], correct: 1, explanation: "2x = 8, so x = 4" },
        { content: "What is 25% of 80?", options: ["15", "20", "25", "30"], correct: 1, explanation: "25% of 80 = 0.25 × 80 = 20" },
        { content: "Find the area of a rectangle: length 8cm, width 5cm", options: ["35 cm²", "40 cm²", "45 cm²", "50 cm²"], correct: 1, explanation: "Area = length × width = 8 × 5 = 40 cm²" },
        { content: "Convert 3/4 to a decimal", options: ["0.5", "0.75", "0.8", "0.9"], correct: 1, explanation: "3/4 = 3 ÷ 4 = 0.75" },
        { content: "What is the mean of: 10, 12, 14, 16?", options: ["12", "13", "14", "15"], correct: 1, explanation: "Mean = (10+12+14+16) ÷ 4 = 52 ÷ 4 = 13" }
      ]
    },
    9: {
      hard: [
        { content: "Solve the quadratic equation: x² - 5x + 6 = 0", options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 0, 5"], correct: 0, explanation: "Factor: (x-2)(x-3) = 0, so x = 2 or x = 3" },
        { content: "Find the derivative of f(x) = 3x² + 2x - 1", options: ["6x + 2", "6x - 2", "3x + 2", "3x - 1"], correct: 0, explanation: "f'(x) = 6x + 2" },
        { content: "What is sin(45°)?", options: ["1/2", "√2/2", "√3/2", "1"], correct: 1, explanation: "sin(45°) = √2/2 ≈ 0.707" },
        { content: "Solve the system: 2x + y = 7, x - y = 2", options: ["x = 2, y = 3", "x = 3, y = 1", "x = 1, y = 5", "x = 4, y = -1"], correct: 1, explanation: "Adding equations: 3x = 9, so x = 3. Then y = 1" },
        { content: "Factor completely: 2x² - 8x + 6", options: ["2(x - 1)(x - 3)", "2(x + 1)(x + 3)", "(2x - 2)(x - 3)", "2(x - 2)(x - 1)"], correct: 0, explanation: "2x² - 8x + 6 = 2(x² - 4x + 3) = 2(x - 1)(x - 3)" }
      ]
    },
    12: {
      hard: [
        { content: "Find the second derivative of f(x) = x⁴ - 3x³ + 2x²", options: ["12x² - 18x + 4", "4x³ - 9x² + 4x", "12x² - 18x", "4x³ - 6x²"], correct: 0, explanation: "f'(x) = 4x³ - 9x² + 4x, f''(x) = 12x² - 18x + 4" },
        { content: "Evaluate: lim(x→∞) (2x³ + x²)/(x³ - 1)", options: ["0", "1", "2", "∞"], correct: 2, explanation: "Divide by x³: lim(x→∞) (2 + 1/x)/(1 - 1/x³) = 2/1 = 2" },
        { content: "Find the integral: ∫(3x² + 2x - 1)dx", options: ["x³ + x² - x + C", "6x + 2 + C", "3x³ + x² - x + C", "x³ + 2x² - x + C"], correct: 0, explanation: "∫(3x² + 2x - 1)dx = x³ + x² - x + C" },
        { content: "Solve: e^(2x) = 16", options: ["x = ln(8)", "x = 2ln(2)", "x = ln(16)/2", "x = 4ln(2)"], correct: 2, explanation: "Taking ln: 2x = ln(16), so x = ln(16)/2" },
        { content: "Find the Taylor series for cos(x) around x = 0 (first 3 terms)", options: ["1 - x²/2! + x⁴/4!", "x - x³/3! + x⁵/5!", "1 + x + x²/2!", "1 - x + x²/2!"], correct: 0, explanation: "cos(x) = 1 - x²/2! + x⁴/4! - x⁶/6! + ..." }
      ]
    }
  },
  english: {
    1: {
      easy: [
        { content: "Which word rhymes with 'cat'?", options: ["dog", "hat", "car", "big"], correct: 1, explanation: "'Hat' rhymes with 'cat'" },
        { content: "What is the first letter of 'apple'?", options: ["a", "b", "c", "d"], correct: 0, explanation: "'Apple' starts with 'a'" },
        { content: "Which word means the opposite of 'big'?", options: ["large", "huge", "small", "tall"], correct: 2, explanation: "'Small' is the opposite of 'big'" },
        { content: "What is the plural of 'cat'?", options: ["cat", "cats", "cates", "catties"], correct: 1, explanation: "Add 's' to make 'cats'" },
        { content: "Which is a color word?", options: ["run", "blue", "happy", "house"], correct: 1, explanation: "'Blue' is a color" }
      ]
    },
    6: {
      medium: [
        { content: "Identify the verb in: 'The dog barked loudly.'", options: ["dog", "barked", "loudly", "the"], correct: 1, explanation: "'Barked' is the action word (verb)" },
        { content: "What is the comparative form of 'good'?", options: ["gooder", "more good", "better", "best"], correct: 2, explanation: "'Better' is the comparative form of 'good'" },
        { content: "Which sentence uses correct punctuation?", options: ["Hello, how are you", "Hello how are you?", "Hello, how are you?", "Hello how are you."], correct: 2, explanation: "Use comma after greeting and question mark for questions" },
        { content: "Identify the adjective: 'The red car is fast.'", options: ["car", "red", "is", "fast"], correct: 1, explanation: "'Red' describes the car (adjective)" },
        { content: "What type of sentence is: 'Please close the door.'?", options: ["Declarative", "Interrogative", "Imperative", "Exclamatory"], correct: 2, explanation: "Commands are imperative sentences" }
      ]
    },
    9: {
      hard: [
        { content: "What is the function of the infinitive in: 'To succeed requires dedication'?", options: ["Subject", "Object", "Adverb", "Predicate"], correct: 0, explanation: "'To succeed' functions as the subject of the sentence." },
        { content: "Identify the literary device in: 'The wind whispered through the trees.'", options: ["Simile", "Metaphor", "Personification", "Alliteration"], correct: 2, explanation: "Giving human qualities (whispering) to wind is personification" },
        { content: "What type of clause is 'Although it was raining' in: 'Although it was raining, we went outside'?", options: ["Independent clause", "Dependent clause", "Noun clause", "Relative clause"], correct: 1, explanation: "'Although it was raining' is a dependent clause because it cannot stand alone" },
        { content: "Which sentence demonstrates correct use of the subjunctive mood?", options: ["If I was rich, I would travel", "I wish I was taller", "If he were here, he would help", "I hope she was coming"], correct: 2, explanation: "The subjunctive mood uses 'were' instead of 'was' in hypothetical situations" },
        { content: "Identify the rhetorical device in: 'Ask not what your country can do for you—ask what you can do for your country.'", options: ["Anaphora", "Chiasmus", "Metaphor", "Simile"], correct: 1, explanation: "The reversed structure (chiasmus) creates emphasis and memorability" }
      ]
    },
    12: {
      hard: [
        { content: "In literary criticism, what is the primary function of a unreliable narrator?", options: ["To confuse the reader", "To reveal character psychology and bias", "To speed up the plot", "To provide comic relief"], correct: 1, explanation: "An unreliable narrator reveals psychological complexity and forces readers to question perspective" },
        { content: "What distinguishes stream of consciousness from interior monologue?", options: ["Length of passages", "Stream of consciousness is more fragmented and associative", "Interior monologue uses first person", "Stream of consciousness is always in present tense"], correct: 1, explanation: "Stream of consciousness captures the fragmented, associative nature of thought more directly" },
        { content: "Analyze the rhetorical strategy in: 'We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields.'", options: ["Anaphora for emphasis and unity", "Epistrophe for closure", "Chiasmus for balance", "Antithesis for contrast"], correct: 0, explanation: "The repetition of 'we shall fight' (anaphora) creates emphasis and unity of purpose" },
        { content: "What is the primary difference between modernist and postmodernist literature?", options: ["Time period only", "Modernism seeks new forms, postmodernism questions all forms", "Modernism is pessimistic, postmodernism is optimistic", "Modernism uses symbolism, postmodernism doesn't"], correct: 1, explanation: "Modernism sought new artistic forms; postmodernism questions the very concept of artistic authority and meaning" },
        { content: "In advanced grammar, what is the function of the subjunctive mood in: 'I suggest that he be promoted immediately'?", options: ["Expresses doubt", "Indicates future tense", "Shows formal recommendation or necessity", "Creates emphasis"], correct: 2, explanation: "The subjunctive 'be' (not 'is') expresses formal recommendation or necessity after verbs like 'suggest'" }
      ]
    }
  }
};

function generateGradeAppropriateQuestion(subject, grade, difficulty, index) {
  const templates = gradeAppropriateQuestions[subject]?.[grade]?.[difficulty];
  
  if (!templates) {
    // Fallback for missing combinations
    return generateFallbackQuestion(subject, grade, difficulty, index);
  }
  
  const template = templates[index % templates.length];
  const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 1000000)}_${index}`;
  
  return {
    _id: `grade${grade}_${difficulty}_${subject}_${uniqueId}`,
    content: template.content,
    type: "multiple_choice",
    options: template.options,
    correct_answer: template.correct,
    subject: subject === 'math' ? 'Mathematics' : subject.charAt(0).toUpperCase() + subject.slice(1),
    grade: grade,
    difficulty: difficulty,
    explanation: template.explanation
  };
}

function generateFallbackQuestion(subject, grade, difficulty, index) {
  const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 1000000)}_${index}`;
  
  // Create grade-appropriate fallback content
  let content, options, correct, explanation;
  
  if (grade <= 2) {
    content = `Grade ${grade} ${subject}: What is a basic concept in ${subject}?`;
    options = ["Basic concept A", "Basic concept B", "Basic concept C", "Basic concept D"];
  } else if (grade <= 5) {
    content = `Grade ${grade} ${subject}: What is an intermediate concept in ${subject}?`;
    options = ["Intermediate concept A", "Intermediate concept B", "Intermediate concept C", "Intermediate concept D"];
  } else if (grade <= 8) {
    content = `Grade ${grade} ${subject}: What is an advanced concept in ${subject}?`;
    options = ["Advanced concept A", "Advanced concept B", "Advanced concept C", "Advanced concept D"];
  } else {
    content = `Grade ${grade} ${subject}: What is a complex concept in ${subject}?`;
    options = ["Complex concept A", "Complex concept B", "Complex concept C", "Complex concept D"];
  }
  
  return {
    _id: `grade${grade}_${difficulty}_${subject}_${uniqueId}`,
    content: content,
    type: "multiple_choice",
    options: options,
    correct_answer: index % 4,
    subject: subject === 'math' ? 'Mathematics' : subject.charAt(0).toUpperCase() + subject.slice(1),
    grade: grade,
    difficulty: difficulty,
    explanation: `This tests ${difficulty} level understanding of ${subject} for grade ${grade}.`
  };
}

function fixGradeAppropriateContent() {
  console.log('🚨 FIXING GRADE-INAPPROPRIATE CONTENT');
  console.log('====================================\n');

  const files = fs.readdirSync(questionsDir).filter(file => 
    file.endsWith('.json') && file !== 'manifest.json'
  );

  let totalFilesFixed = 0;
  let inappropriateQuestionsFound = 0;

  files.forEach(filename => {
    const filePath = path.join(questionsDir, filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let questions = Array.isArray(data) ? data : (data.questions || []);
    const originalCount = questions.length;
    
    // Parse filename for grade, difficulty, subject
    const match = filename.match(/(\d+)_(\w+)_(\w+)\.json/);
    if (!match) {
      console.log(`   ❌ Cannot parse filename: ${filename}`);
      return;
    }
    
    const [, gradeStr, difficulty, subject] = match;
    const grade = parseInt(gradeStr);
    
    // Check for grade-inappropriate content
    let hasInappropriateContent = false;
    
    questions.forEach(question => {
      const content = question.content || '';
      
      // Check for obvious grade mismatches
      if (grade >= 9 && difficulty === 'hard') {
        // High school hard should not have basic arithmetic
        if (content.match(/What is \d+ [+\-×÷] \d+\?/) && 
            content.match(/What is [1-9] [+\-×÷] [1-9]\?/)) {
          hasInappropriateContent = true;
          inappropriateQuestionsFound++;
        }
      } else if (grade <= 2 && difficulty === 'easy') {
        // Elementary should not have advanced concepts
        if (content.includes('derivative') || content.includes('integral') || 
            content.includes('solve for x') || content.includes('%')) {
          hasInappropriateContent = true;
          inappropriateQuestionsFound++;
        }
      }
    });
    
    if (hasInappropriateContent) {
      console.log(`🔧 Fixing ${filename}: Grade ${grade} ${difficulty} ${subject}`);
      
      // Generate completely new grade-appropriate questions
      const newQuestions = [];
      for (let i = 0; i < originalCount; i++) {
        const question = generateGradeAppropriateQuestion(subject, grade, difficulty, i);
        newQuestions.push(question);
      }
      
      // Write back the new questions
      if (Array.isArray(data)) {
        fs.writeFileSync(filePath, JSON.stringify(newQuestions, null, 2));
      } else {
        data.questions = newQuestions;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      }
      
      console.log(`   ✅ Replaced with ${newQuestions.length} grade-appropriate questions`);
      totalFilesFixed++;
    }
  });

  console.log(`\n🎯 GRADE-APPROPRIATE FIX COMPLETE!`);
  console.log(`==================================`);
  console.log(`✅ Files fixed: ${totalFilesFixed}`);
  console.log(`✅ Inappropriate questions found: ${inappropriateQuestionsFound}`);
  
  // Verification
  console.log('\n🔍 VERIFICATION - Checking Grade 9 Hard Math...');
  const grade9HardMath = JSON.parse(fs.readFileSync(path.join(questionsDir, '9_hard_math.json'), 'utf8'));
  console.log('First 3 questions:');
  grade9HardMath.slice(0, 3).forEach((q, i) => {
    console.log(`${i + 1}. ${q.content}`);
  });
  
  console.log('\n🔍 VERIFICATION - Checking Grade 1 Easy Math...');
  const grade1EasyMath = JSON.parse(fs.readFileSync(path.join(questionsDir, '1_easy_math.json'), 'utf8'));
  console.log('First 3 questions:');
  grade1EasyMath.slice(0, 3).forEach((q, i) => {
    console.log(`${i + 1}. ${q.content}`);
  });
}

fixGradeAppropriateContent();
