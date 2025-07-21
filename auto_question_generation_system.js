/**
 * Automated Thinking Skills Question Generation System
 * 
 * This system automatically generates new thinking skills questions
 * when users have answered existing ones, without requiring any manual intervention.
 */

// Configuration
const SUPPORTED_GRADES = [4, 5, 6, 7, 8];
const QUESTION_POOL_MIN_SIZE = 10;
const TEMPLATE_VARIATION_THRESHOLD = 20;
const AUTO_GENERATION_INTERVAL = 3600000; // 1 hour in milliseconds

/**
 * Main class for automatic question generation
 */
class AutoQuestionGenerator {
  constructor() {
    this.templateCache = {};
    this.questionPools = {};
    this.generationQueue = [];
    this.isGenerating = false;
    
    // Initialize the system
    this.initialize();
  }
  
  /**
   * Initialize the auto-generation system
   */
  initialize() {
    console.log("Initializing automatic question generation system");
    
    // Load templates for all supported grades
    this.loadAllTemplates();
    
    // Set up automatic generation interval
    setInterval(() => this.checkAndReplenishQuestionPools(), AUTO_GENERATION_INTERVAL);
    
    // Set up event listeners for question usage
    this.setupEventListeners();
    
    // Initial check and generation
    this.checkAndReplenishQuestionPools();
  }
  
  /**
   * Load all templates for all supported grades
   */
  loadAllTemplates() {
    for (const grade of SUPPORTED_GRADES) {
      this.loadTemplatesForGrade(grade);
    }
  }
  
  /**
   * Load templates for a specific grade
   */
  loadTemplatesForGrade(grade) {
    try {
      // In a real implementation, this would load from a database or file
      console.log(`Loading templates for grade ${grade}`);
      
      // Simulate loading templates
      const templates = this.fetchTemplatesFromDatabase(grade);
      
      if (templates.length === 0) {
        console.warn(`No templates found for grade ${grade}. Generating from adjacent grades.`);
        this.generateTemplatesFromAdjacentGrades(grade);
      } else {
        this.templateCache[grade] = templates;
        console.log(`Loaded ${templates.length} templates for grade ${grade}`);
      }
    } catch (error) {
      console.error(`Error loading templates for grade ${grade}:`, error);
    }
  }
  
  /**
   * Generate templates for a grade based on adjacent grades
   */
  generateTemplatesFromAdjacentGrades(grade) {
    // Find the closest grades that have templates
    const adjacentGrades = SUPPORTED_GRADES.filter(g => g !== grade)
      .sort((a, b) => Math.abs(a - grade) - Math.abs(b - grade));
    
    if (adjacentGrades.length === 0) {
      console.error(`No adjacent grades found to generate templates for grade ${grade}`);
      return;
    }
    
    const sourceGrade = adjacentGrades[0];
    const sourceTemplates = this.fetchTemplatesFromDatabase(sourceGrade);
    
    if (sourceTemplates.length === 0) {
      console.error(`No templates found in grade ${sourceGrade} to adapt for grade ${grade}`);
      return;
    }
    
    // Adapt templates from the source grade
    const adaptedTemplates = sourceTemplates.map(template => {
      return this.adaptTemplateForGrade(template, sourceGrade, grade);
    });
    
    // Save the adapted templates
    this.saveTemplatesToDatabase(grade, adaptedTemplates);
    this.templateCache[grade] = adaptedTemplates;
    
    console.log(`Generated ${adaptedTemplates.length} templates for grade ${grade} from grade ${sourceGrade}`);
  }
  
  /**
   * Adapt a template for a different grade level
   */
  adaptTemplateForGrade(template, sourceGrade, targetGrade) {
    const adaptedTemplate = JSON.parse(JSON.stringify(template));
    
    // Update template ID and grade level
    adaptedTemplate.template_id = template.template_id.replace(`G${sourceGrade}`, `G${targetGrade}`);
    adaptedTemplate.grade_level = targetGrade;
    
    // Adjust difficulty based on grade difference
    const gradeDifference = targetGrade - sourceGrade;
    adaptedTemplate.difficulty = Math.max(1, Math.min(5, template.difficulty + gradeDifference));
    
    // Adjust language complexity
    if (gradeDifference < 0) {
      // Simplify for lower grades
      if (adaptedTemplate.structure.scenario) {
        adaptedTemplate.structure.scenario = this.simplifyLanguage(adaptedTemplate.structure.scenario);
      }
      if (adaptedTemplate.structure.question) {
        adaptedTemplate.structure.question = this.simplifyLanguage(adaptedTemplate.structure.question);
      }
    } else if (gradeDifference > 0) {
      // Make more complex for higher grades
      if (adaptedTemplate.structure.scenario) {
        adaptedTemplate.structure.scenario = this.makeLanguageMoreComplex(adaptedTemplate.structure.scenario);
      }
      if (adaptedTemplate.structure.question) {
        adaptedTemplate.structure.question = this.makeLanguageMoreComplex(adaptedTemplate.structure.question);
      }
    }
    
    return adaptedTemplate;
  }
  
  /**
   * Simplify language for lower grades
   */
  simplifyLanguage(text) {
    // Replace complex words with simpler alternatives
    const simplifications = {
      "consequently": "so",
      "nevertheless": "still",
      "approximately": "about",
      "sufficient": "enough",
      "determine": "find out",
      "frequently": "often",
      "demonstrate": "show",
      "initially": "first",
      "subsequently": "later",
      "additional": "more"
    };
    
    let simplifiedText = text;
    
    for (const [complex, simple] of Object.entries(simplifications)) {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      simplifiedText = simplifiedText.replace(regex, simple);
    }
    
    // Shorten sentences
    simplifiedText = simplifiedText
      .replace(/([.!?])\s+([A-Z])/g, '$1\n$2')
      .split('\n')
      .map(sentence => {
        if (sentence.split(' ').length > 15) {
          // Try to break long sentences
          return sentence.replace(/,\s+and\s+/g, '.\n');
        }
        return sentence;
      })
      .join(' ');
    
    return simplifiedText;
  }
  
  /**
   * Make language more complex for higher grades
   */
  makeLanguageMoreComplex(text) {
    // Replace simple words with more complex alternatives
    const complexifications = {
      "so": "consequently",
      "still": "nevertheless",
      "about": "approximately",
      "enough": "sufficient",
      "find out": "determine",
      "often": "frequently",
      "show": "demonstrate",
      "first": "initially",
      "later": "subsequently",
      "more": "additional"
    };
    
    let complexText = text;
    
    for (const [simple, complex] of Object.entries(complexifications)) {
      const regex = new RegExp(`\\b${simple}\\b`, 'gi');
      complexText = complexText.replace(regex, complex);
    }
    
    return complexText;
  }
  
  /**
   * Set up event listeners for question usage
   */
  setupEventListeners() {
    // Listen for question answered events
    document.addEventListener('questionAnswered', (event) => {
      const { userId, grade, questionId } = event.detail;
      this.onQuestionAnswered(userId, grade, questionId);
    });
    
    // Listen for session start events
    document.addEventListener('sessionStarted', (event) => {
      const { userId, grade } = event.detail;
      this.ensureQuestionPoolForUser(userId, grade);
    });
  }
  
  /**
   * Handle question answered event
   */
  onQuestionAnswered(userId, grade, questionId) {
    // Mark question as used
    this.markQuestionAsUsed(userId, questionId);
    
    // Check if we need to generate more questions
    this.checkUserQuestionPool(userId, grade);
  }
  
  /**
   * Check and replenish all question pools
   */
  checkAndReplenishQuestionPools() {
    console.log("Checking all question pools");
    
    // Get all active users
    const activeUsers = this.getActiveUsers();
    
    for (const user of activeUsers) {
      for (const grade of SUPPORTED_GRADES) {
        this.checkUserQuestionPool(user.id, grade);
      }
    }
    
    // Process the generation queue
    this.processGenerationQueue();
  }
  
  /**
   * Check a specific user's question pool for a grade
   */
  checkUserQuestionPool(userId, grade) {
    const poolKey = `${userId}_${grade}`;
    const pool = this.questionPools[poolKey] || [];
    
    // Count available (unused) questions
    const availableQuestions = pool.filter(q => !q.used).length;
    
    if (availableQuestions < QUESTION_POOL_MIN_SIZE) {
      console.log(`User ${userId} has only ${availableQuestions} questions available for grade ${grade}. Adding to generation queue.`);
      
      // Add to generation queue
      this.generationQueue.push({
        userId,
        grade,
        count: QUESTION_POOL_MIN_SIZE - availableQuestions
      });
      
      // Process the queue if not already processing
      if (!this.isGenerating) {
        this.processGenerationQueue();
      }
    }
  }
  
  /**
   * Process the generation queue
   */
  async processGenerationQueue() {
    if (this.isGenerating || this.generationQueue.length === 0) {
      return;
    }
    
    this.isGenerating = true;
    
    try {
      while (this.generationQueue.length > 0) {
        const task = this.generationQueue.shift();
        await this.generateQuestionsForUser(task.userId, task.grade, task.count);
      }
    } catch (error) {
      console.error("Error processing generation queue:", error);
    } finally {
      this.isGenerating = false;
    }
  }
  
  /**
   * Generate questions for a specific user
   */
  async generateQuestionsForUser(userId, grade, count) {
    console.log(`Generating ${count} questions for user ${userId}, grade ${grade}`);
    
    // Get templates for this grade
    const templates = this.templateCache[grade] || [];
    
    if (templates.length === 0) {
      console.error(`No templates available for grade ${grade}`);
      return;
    }
    
    // Get user's question history
    const userHistory = this.getUserQuestionHistory(userId, grade);
    
    // Generate questions
    const generatedQuestions = [];
    
    for (let i = 0; i < count; i++) {
      // Select a template based on user's history
      const template = this.selectTemplateForUser(userId, grade, templates, userHistory);
      
      if (!template) {
        console.warn(`Could not select a suitable template for user ${userId}, grade ${grade}`);
        continue;
      }
      
      // Generate a question from the template
      const question = await this.generateQuestionFromTemplate(template, userHistory);
      
      if (question) {
        generatedQuestions.push(question);
        userHistory.push(question);
      }
    }
    
    // Add to user's question pool
    this.addQuestionsToUserPool(userId, grade, generatedQuestions);
    
    console.log(`Generated ${generatedQuestions.length} questions for user ${userId}, grade ${grade}`);
  }
  
  /**
   * Select a template for a user based on their history
   */
  selectTemplateForUser(userId, grade, templates, history) {
    // Get user performance data
    const performanceData = this.getUserPerformanceData(userId, grade);
    
    // Identify weak categories
    const weakCategories = this.identifyWeakCategories(performanceData);
    
    // Prioritize templates from weak categories
    if (weakCategories.length > 0 && Math.random() < 0.7) {
      const category = this.getRandomItem(weakCategories);
      const categoryTemplates = templates.filter(t => t.category === category);
      
      if (categoryTemplates.length > 0) {
        return this.selectLeastUsedTemplate(categoryTemplates, history);
      }
    }
    
    // Otherwise, select a balanced mix
    return this.selectLeastUsedTemplate(templates, history);
  }
  
  /**
   * Select the least recently used template
   */
  selectLeastUsedTemplate(templates, history) {
    // Count usage of each template
    const templateUsage = {};
    
    for (const template of templates) {
      templateUsage[template.template_id] = 0;
    }
    
    for (const question of history) {
      if (templateUsage[question.template_id] !== undefined) {
        templateUsage[question.template_id]++;
      }
    }
    
    // Sort templates by usage
    const sortedTemplates = [...templates].sort((a, b) => {
      return templateUsage[a.template_id] - templateUsage[b.template_id];
    });
    
    // If the least used template has been used too many times, introduce randomness
    if (sortedTemplates.length > 0 && templateUsage[sortedTemplates[0].template_id] > TEMPLATE_VARIATION_THRESHOLD) {
      // Randomly select from the least used 50% of templates
      const cutoff = Math.floor(sortedTemplates.length / 2);
      const index = Math.floor(Math.random() * Math.max(1, cutoff));
      return sortedTemplates[index];
    }
    
    // Otherwise, use the least used template
    return sortedTemplates[0];
  }
  
  /**
   * Generate a question from a template
   */
  async generateQuestionFromTemplate(template, history) {
    try {
      // Create a deep copy of the template
      const questionData = JSON.parse(JSON.stringify(template));
      
      // Get previously used variable combinations for this template
      const usedCombinations = history
        .filter(q => q.template_id === template.template_id)
        .map(q => this.getVariableCombinationSignature(q));
      
      // Try to generate a unique combination
      let attempts = 0;
      let isUnique = false;
      let generatedQuestion;
      
      while (!isUnique && attempts < 10) {
        attempts++;
        
        // Fill in variables from pools
        generatedQuestion = await this.instantiateTemplate(questionData);
        
        // Check if this combination has been used before
        const signature = this.getVariableCombinationSignature(generatedQuestion);
        isUnique = !usedCombinations.includes(signature);
        
        // If we've tried too many times, allow reuse but with maximum variation
        if (attempts >= 5 && !isUnique) {
          generatedQuestion = await this.generateWithMaximumVariation(questionData, usedCombinations);
          break;
        }
      }
      
      // Add metadata
      generatedQuestion.id = this.generateUniqueId();
      generatedQuestion.created_at = new Date().toISOString();
      generatedQuestion.used = false;
      
      return generatedQuestion;
    } catch (error) {
      console.error("Error generating question from template:", error);
      return null;
    }
  }
  
  /**
   * Instantiate a template with variables
   */
  async instantiateTemplate(template) {
    // Create a deep copy
    const question = JSON.parse(JSON.stringify(template));
    
    // Add parameters object if it doesn't exist
    if (!question.parameters) {
      question.parameters = {};
    }
    
    // Select theme if applicable
    let selectedTheme = null;
    if (template.variable_pools && template.variable_pools.location_themes) {
      selectedTheme = this.getRandomItem(template.variable_pools.location_themes);
      question.parameters.theme = selectedTheme.theme;
    }
    
    // Fill in variables from pools
    if (template.variable_pools) {
      for (const [key, pool] of Object.entries(template.variable_pools)) {
        // Skip location_themes as we've already handled it
        if (key === 'location_themes') continue;
        
        if (Array.isArray(pool)) {
          // Simple array pool
          question.parameters[key] = this.getRandomItem(pool);
        } else if (typeof pool === 'object' && pool !== null) {
          // Object pool (like position_descriptions)
          const poolKeys = Object.keys(pool);
          if (poolKeys.length > 0) {
            const randomKey = this.getRandomItem(poolKeys);
            question.parameters[key] = randomKey;
            
            // If the value is also needed, store it
            if (typeof pool[randomKey] !== 'undefined') {
              question.parameters[`${key}_value`] = pool[randomKey];
            }
          }
        }
      }
    }
    
    // Apply specific logic based on template type
    if (template.template_id.startsWith('TS-G') && template.template_id.includes('-L')) {
      // Logical reasoning question
      await this.generateLogicalReasoningQuestion(question, selectedTheme);
    } else if (template.template_id.startsWith('TS-G') && template.template_id.includes('-P')) {
      // Pattern recognition question
      await this.generatePatternRecognitionQuestion(question);
    } else if (template.template_id.startsWith('TS-G') && template.template_id.includes('-S')) {
      // Spatial reasoning question
      await this.generateSpatialReasoningQuestion(question);
    }
    
    // Generate the final question text by replacing placeholders
    question.question_text = this.replacePlaceholders(template.structure.scenario, question.parameters);
    question.question_prompt = this.replacePlaceholders(template.structure.question, question.parameters);
    
    // Generate options
    question.options = template.structure.options.map(option => 
      this.replacePlaceholders(option, question.parameters)
    );
    
    // Determine correct answer
    question.correct_answer = this.determineCorrectAnswer(question);
    
    return question;
  }
  
  /**
   * Generate a logical reasoning question
   */
  async generateLogicalReasoningQuestion(question, theme) {
    // Implementation depends on the specific template
    // This is a simplified example
    
    if (question.template_id.includes('SEQ')) {
      // Sequence question (like train/bus journey)
      const stations = theme ? theme.locations.slice(0, 5) : ['A', 'B', 'C', 'D', 'E'];
      
      question.parameters.start_location = stations[0];
      question.parameters.end_location = stations[stations.length - 1];
      question.parameters.station1 = stations[3];
      question.parameters.station2 = stations[1];
      question.parameters.station3 = stations[4];
      question.parameters.station4 = stations[2];
      
      // The correct station depends on the position_description
      const posDesc = question.parameters.position_description;
      const posValue = question.parameters.position_description_value;
      
      if (posDesc === 'second-last station') {
        question.parameters.correct_station = stations[3]; // station1
      } else if (posDesc === 'third station') {
        question.parameters.correct_station = stations[2]; // station4
      } else {
        question.parameters.correct_station = stations[posValue - 1];
      }
    }
  }
  
  /**
   * Generate a pattern recognition question
   */
  async generatePatternRecognitionQuestion(question) {
    // Implementation depends on the specific template
    // This is a simplified example
    
    if (question.template_id.includes('SEQ')) {
      // Sequence decoding question
      const sentence = question.parameters.secret_sentence;
      const startPos = question.parameters.starting_position || 1;
      
      // Calculate example letters
      const exPos1 = question.parameters.example_pos1;
      const exPos2 = question.parameters.example_pos2;
      question.parameters.example_letter1 = sentence[exPos1 + startPos - 2] || 'x';
      question.parameters.example_letter2 = sentence[exPos2 + startPos - 2] || 'y';
      
      // Calculate solution letters
      const qPos1 = question.parameters.question_pos1;
      const qPos2 = question.parameters.question_pos2;
      question.parameters.solution_letter1 = sentence[qPos1 + startPos - 2] || 'a';
      question.parameters.solution_letter2 = sentence[qPos2 + startPos - 2] || 'b';
    }
  }
  
  /**
   * Generate a spatial reasoning question
   */
  async generateSpatialReasoningQuestion(question) {
    // Implementation depends on the specific template
    // For spatial reasoning, we would typically need to reference pre-created images
    // This is a simplified placeholder
    
    // In a real implementation, this would select appropriate images or generate them
    question.parameters.image_url = `https://example.com/images/${question.template_id}_${question.parameters.object_type}.png`;
    question.parameters.option_a_image = `https://example.com/images/${question.template_id}_${question.parameters.object_type}_a.png`;
    question.parameters.option_b_image = `https://example.com/images/${question.template_id}_${question.parameters.object_type}_b.png`;
    question.parameters.option_c_image = `https://example.com/images/${question.template_id}_${question.parameters.object_type}_c.png`;
    question.parameters.option_d_image = `https://example.com/images/${question.template_id}_${question.parameters.object_type}_d.png`;
  }
  
  /**
   * Replace placeholders in a text with actual values
   */
  replacePlaceholders(text, parameters) {
    if (!text) return '';
    
    let result = text;
    
    // Replace all {placeholder} with the corresponding parameter value
    const placeholderRegex = /{([^}]+)}/g;
    result = result.replace(placeholderRegex, (match, placeholder) => {
      return parameters[placeholder] !== undefined ? parameters[placeholder] : match;
    });
    
    return result;
  }
  
  /**
   * Determine the correct answer for a question
   */
  determineCorrectAnswer(question) {
    // This depends on the specific template and question type
    // In a real implementation, this would be more sophisticated
    
    // For now, we'll just use the first option as correct
    return 'A';
  }
  
  /**
   * Generate with maximum variation from used combinations
   */
  async generateWithMaximumVariation(template, usedCombinations) {
    // Generate multiple candidates
    const candidates = [];
    
    for (let i = 0; i < 5; i++) {
      candidates.push(await this.instantiateTemplate(template));
    }
    
    // Find the candidate with maximum difference from used combinations
    let bestCandidate = candidates[0];
    let maxDifference = 0;
    
    for (const candidate of candidates) {
      const signature = this.getVariableCombinationSignature(candidate);
      let minDifference = Infinity;
      
      for (const usedCombo of usedCombinations) {
        const difference = this.calculateDifference(signature, usedCombo);
        minDifference = Math.min(minDifference, difference);
      }
      
      if (minDifference > maxDifference) {
        maxDifference = minDifference;
        bestCandidate = candidate;
      }
    }
    
    return bestCandidate;
  }
  
  /**
   * Get a signature for a variable combination
   */
  getVariableCombinationSignature(question) {
    // Create a signature based on the variable values used
    const values = [];
    
    if (question.parameters) {
      for (const key in question.parameters) {
        values.push(`${key}:${question.parameters[key]}`);
      }
    }
    
    return values.join('|');
  }
  
  /**
   * Calculate difference between two variable combinations
   */
  calculateDifference(signature1, signature2) {
    // Simple Levenshtein distance
    const s1 = signature1.split('|');
    const s2 = signature2.split('|');
    
    let different = 0;
    
    // Count different values
    for (const item of s1) {
      if (!s2.includes(item)) {
        different++;
      }
    }
    
    for (const item of s2) {
      if (!s1.includes(item)) {
        different++;
      }
    }
    
    return different;
  }
  
  /**
   * Add questions to a user's pool
   */
  addQuestionsToUserPool(userId, grade, questions) {
    const poolKey = `${userId}_${grade}`;
    
    if (!this.questionPools[poolKey]) {
      this.questionPools[poolKey] = [];
    }
    
    this.questionPools[poolKey].push(...questions);
    
    // In a real implementation, this would also save to a database
    this.saveQuestionPoolToDatabase(userId, grade, this.questionPools[poolKey]);
  }
  
  /**
   * Mark a question as used
   */
  markQuestionAsUsed(userId, questionId) {
    // Find the question in all pools for this user
    for (const grade of SUPPORTED_GRADES) {
      const poolKey = `${userId}_${grade}`;
      const pool = this.questionPools[poolKey] || [];
      
      const question = pool.find(q => q.id === questionId);
      if (question) {
        question.used = true;
        question.used_at = new Date().toISOString();
        
        // In a real implementation, this would also update the database
        this.saveQuestionPoolToDatabase(userId, grade, pool);
        break;
      }
    }
  }
  
  /**
   * Ensure a question pool exists for a user
   */
  ensureQuestionPoolForUser(userId, grade) {
    const poolKey = `${userId}_${grade}`;
    
    if (!this.questionPools[poolKey]) {
      // Try to load from database first
      const savedPool = this.loadQuestionPoolFromDatabase(userId, grade);
      
      if (savedPool && savedPool.length > 0) {
        this.questionPools[poolKey] = savedPool;
      } else {
        // Create a new pool
        this.questionPools[poolKey] = [];
        
        // Add to generation queue
        this.generationQueue.push({
          userId,
          grade,
          count: QUESTION_POOL_MIN_SIZE
        });
        
        // Process the queue
        if (!this.isGenerating) {
          this.processGenerationQueue();
        }
      }
    }
  }
  
  /**
   * Get a random item from an array
   */
  getRandomItem(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  }
  
  /**
   * Generate a unique ID
   */
  generateUniqueId() {
    return 'q_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
  
  /**
   * Identify weak categories based on performance data
   */
  identifyWeakCategories(performanceData) {
    const weakCategories = [];
    
    if (!performanceData || !performanceData.categories) {
      return weakCategories;
    }
    
    for (const [category, data] of Object.entries(performanceData.categories)) {
      if (data.total >= 3 && data.success_rate < 0.6) {
        weakCategories.push(category);
      }
    }
    
    return weakCategories;
  }
  
  // Database simulation methods
  // In a real implementation, these would interact with an actual database
  
  fetchTemplatesFromDatabase(grade) {
    // Simulate fetching templates from a database
    console.log(`Fetching templates for grade ${grade} from database`);
    return [];
  }
  
  saveTemplatesToDatabase(grade, templates) {
    // Simulate saving templates to a database
    console.log(`Saving ${templates.length} templates for grade ${grade} to database`);
  }
  
  getActiveUsers() {
    // Simulate getting active users from a database
    return [{ id: 'user1' }, { id: 'user2' }];
  }
  
  getUserQuestionHistory(userId, grade) {
    // Simulate getting user question history from a database
    return [];
  }
  
  getUserPerformanceData(userId, grade) {
    // Simulate getting user performance data from a database
    return {
      categories: {
        "Logical Reasoning": { total: 10, correct: 7, success_rate: 0.7 },
        "Spatial Reasoning": { total: 8, correct: 3, success_rate: 0.375 },
        "Pattern Recognition": { total: 5, correct: 4, success_rate: 0.8 }
      }
    };
  }
  
  loadQuestionPoolFromDatabase(userId, grade) {
    // Simulate loading a question pool from a database
    return [];
  }
  
  saveQuestionPoolToDatabase(userId, grade, pool) {
    // Simulate saving a question pool to a database
    console.log(`Saving question pool for user ${userId}, grade ${grade} (${pool.length} questions)`);
  }
}

// Create and export the generator instance
const autoQuestionGenerator = new AutoQuestionGenerator();

// Export for use in other modules
export default autoQuestionGenerator;
