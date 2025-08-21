const fs = require('fs');
const path = require('path');

// Simulate the exact frontend call pattern
class TestStaticQuestionLoader {
  static cache = new Map();
  static loadingPromises = new Map();

  static async getQuestions(grade, difficulty, subject, count = 20) {
    console.log(`🔍 StaticQuestionLoader.getQuestions("${grade}", "${difficulty}", "${subject}", ${count})`);
    
    const normalizedSubject = this.normalizeSubject(subject || 'math');
    const key = this.getKey(grade, difficulty, normalizedSubject);
    
    console.log(`📝 Normalized subject: "${normalizedSubject}"`);
    console.log(`📝 Generated key: "${key}"`);
    
    // Check cache first
    if (this.cache.has(key)) {
      console.log(`📦 Using cached questions for ${key}`);
      return this.selectQuestions(this.cache.get(key), count);
    }
    
    // Check if loading is in progress
    if (this.loadingPromises.has(key)) {
      console.log(`⏳ Waiting for ongoing load for ${key}`);
      const questions = await this.loadingPromises.get(key);
      return this.selectQuestions(questions, count);
    }
    
    // Load questions from file
    console.log(`📁 Loading questions from file for ${key}`);
    const loadPromise = this.loadQuestionsFromFile(key);
    this.loadingPromises.set(key, loadPromise);
    
    try {
      const questions = await loadPromise;
      this.cache.set(key, questions);
      console.log(`✅ Loaded ${questions.length} questions for ${key}`);
      return this.selectQuestions(questions, count);
    } finally {
      this.loadingPromises.delete(key);
    }
  }

  static async loadQuestionsFromFile(key) {
    try {
      const filename = `${key}.json`;
      const filePath = path.join('/workspaces/AWSQCLI/testace-app/frontend/public/questions', filename);
      
      if (!fs.existsSync(filePath)) {
        console.log(`📄 Question file not found for ${key}, using generated questions`);
        return [];
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      const questions = JSON.parse(content);
      
      // Validate questions have required fields
      const validQuestions = questions.filter(q => 
        q._id && 
        q.content && 
        q.options && 
        q.correctAnswer &&
        q.subject &&
        q.grade &&
        q.difficulty
      );
      
      console.log(`📄 File validation: ${validQuestions.length}/${questions.length} questions valid`);
      
      // Apply subject filtering
      const keyParts = key.split('_');
      const expectedSubject = keyParts[keyParts.length - 1];
      
      const subjectMapping = {
        'math': ['Mathematics', 'math'],
        'english': ['English', 'english'],
        'reading': ['Reading', 'reading'],
        'thinking-skills': ['Thinking Skills', 'thinking-skills'],
        'mathematical-reasoning': ['Mathematical Reasoning', 'mathematical-reasoning']
      };
      
      const expectedQuestionSubjects = subjectMapping[expectedSubject];
      if (expectedQuestionSubjects) {
        const filtered = validQuestions.filter(q => 
          expectedQuestionSubjects.includes(q.subject) ||
          expectedQuestionSubjects.some(s => s.toLowerCase().replace(/\s+/g, '-') === q.subject.toLowerCase().replace(/\s+/g, '-'))
        );
        console.log(`🔍 Subject filter: ${filtered.length}/${validQuestions.length} questions match subjects ${expectedQuestionSubjects.join(' or ')}`);
        return filtered;
      }
      
      return validQuestions;
      
    } catch (error) {
      console.log(`📄 Question file not available for ${key}, using generated questions`);
      return [];
    }
  }

  static selectQuestions(questions, count) {
    if (questions.length === 0) {
      return [];
    }
    
    const shuffled = this.shuffleArray([...questions]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  static normalizeSubject(subject) {
    if (!subject) return 'math';
    
    const normalized = subject.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    const subjectMap = {
      'mathematics': 'math',
      'maths': 'math',
      'language': 'english',
      'language-arts': 'english',
      'comprehension': 'reading',
      'reading-comprehension': 'reading',
      'critical-thinking': 'thinking-skills',
      'logic': 'thinking-skills',
      'reasoning': 'mathematical-reasoning',
      'math-reasoning': 'mathematical-reasoning'
    };
    
    return subjectMap[normalized] || normalized;
  }

  static getKey(grade, difficulty, subject) {
    return `${grade}_${difficulty}_${subject}`;
  }

  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Test the exact call that would be made from the frontend
async function testFrontendCall() {
  console.log('🧪 Testing exact frontend call pattern...\n');
  
  // This mimics the call from PracticeSession.tsx
  const questions = await TestStaticQuestionLoader.getQuestions(
    '9',        // grade
    'hard',     // difficulty
    'reading',  // subject
    20          // count
  );
  
  console.log(`\n📊 FINAL RESULT:`);
  console.log(`   Questions returned: ${questions.length}`);
  
  if (questions.length === 0) {
    console.log(`   ❌ This would cause "No questions available" error!`);
  } else {
    console.log(`   ✅ Questions should load successfully`);
    console.log(`   📝 Sample: "${questions[0].content.substring(0, 50)}..."`);
  }
}

testFrontendCall().catch(console.error);
