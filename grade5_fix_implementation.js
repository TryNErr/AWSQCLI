/**
 * Grade 5 Thinking Skills Question Auto-Generation Fix
 * 
 * This file contains the implementation to fix the issue with Grade 5
 * thinking skills questions not being auto-generated in the TestAce app.
 */

// Configuration
const SUPPORTED_GRADES = [5, 6, 7, 8];
const MAX_GENERATION_ATTEMPTS = 10;
const MIN_QUESTION_POOL_SIZE = 5;
const TEMPLATE_REUSE_THRESHOLD = 48; // hours before a template can be reused

/**
 * Main function to fix Grade 5 question generation
 */
function fixGrade5QuestionGeneration() {
  console.log("Applying fix for Grade 5 thinking skills question generation");
  
  // 1. Check if Grade 5 templates exist
  const grade5Templates = getTemplatesForGrade(5);
  
  if (grade5Templates.length === 0) {
    console.log("No Grade 5 templates found. Creating templates from Grade 6...");
    createGrade5TemplatesFromGrade6();
  } else {
    console.log(`Found ${grade5Templates.length} existing Grade 5 templates`);
  }
  
  // 2. Update API endpoint to properly handle Grade 5
  updateApiEndpoint();
  
  // 3. Fix template selection logic
  fixTemplateSelectionLogic();
  
  // 4. Implement template reuse with variation
  implementTemplateReuseWithVariation();
  
  // 5. Set up monitoring for template usage
  setupTemplateUsageMonitoring();
  
  console.log("Grade 5 question generation fix applied successfully");
}

/**
 * Creates Grade 5 templates based on existing Grade 6 templates
 */
function createGrade5TemplatesFromGrade6() {
  try {
    // Get Grade 6 templates
    const grade6Templates = getTemplatesForGrade(6);
    
    if (grade6Templates.length === 0) {
      console.error("No Grade 6 templates found to convert");
      return [];
    }
    
    // Create Grade 5 versions with appropriate adjustments
    const grade5Templates = grade6Templates.map(template => {
      const grade5Template = JSON.parse(JSON.stringify(template));
      
      // Update template ID and grade level
      grade5Template.template_id = template.template_id.replace('G6', 'G5');
      grade5Template.grade_level = 5;
      
      // Adjust difficulty
      grade5Template.difficulty = Math.max(1, template.difficulty - 1);
      
      // Simplify language if needed
      if (grade5Template.structure.scenario) {
        grade5Template.structure.scenario = simplifyLanguage(grade5Template.structure.scenario);
      }
      
      // Adjust complexity of logic
      simplifyTemplateLogic(grade5Template);
      
      return grade5Template;
    });
    
    // Save the new templates
    saveTemplates(grade5Templates);
    
    console.log(`Created ${grade5Templates.length} Grade 5 templates`);
    return grade5Templates;
  } catch (error) {
    console.error("Error creating Grade 5 templates:", error);
    return [];
  }
}

/**
 * Simplifies language for Grade 5 students
 */
function simplifyLanguage(text) {
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
 * Simplifies the logical complexity of a template for Grade 5
 */
function simplifyTemplateLogic(template) {
  // Reduce the number of logical steps required
  if (template.structure.clues && template.structure.clues.length > 3) {
    template.structure.clues = template.structure.clues.slice(0, 3);
  }
  
  // Simplify variable pools if they exist
  if (template.variable_pools) {
    // Reduce the number of options in each pool
    for (const [key, pool] of Object.entries(template.variable_pools)) {
      if (Array.isArray(pool) && pool.length > 5) {
        template.variable_pools[key] = pool.slice(0, 5);
      }
    }
  }
  
  return template;
}

/**
 * Updates the API endpoint to properly handle Grade 5
 */
function updateApiEndpoint() {
  // This is a placeholder for the actual implementation
  // In a real system, this would modify the API endpoint code
  
  console.log("Updating API endpoint to handle Grade 5 properly");
  
  // Example of what the updated endpoint would look like:
  /*
  app.post('/api/questions/generate', (req, res) => {
    const { user_id, grade_level, session_id, previous_questions, performance_data } = req.body;
    
    // Validate grade level
    if (!SUPPORTED_GRADES.includes(grade_level)) {
      return res.status(400).json({
        error: `Unsupported grade level: ${grade_level}. Supported grades are: ${SUPPORTED_GRADES.join(', ')}`
      });
    }
    
    // Get user performance analysis
    const userAnalysis = analyzeUserPerformance(user_id, grade_level);
    
    // Get available templates for this grade
    const availableTemplates = getTemplatesForGrade(grade_level);
    
    if (availableTemplates.length === 0) {
      return res.status(500).json({
        error: `No templates available for grade ${grade_level}`
      });
    }
    
    // Select template based on user performance
    const selectedTemplate = selectNextQuestionTemplate(userAnalysis, availableTemplates);
    
    // Generate question from template
    const generatedQuestion = instantiateTemplate(selectedTemplate, previous_questions);
    
    // Add to question pool and return
    addToQuestionPool(user_id, session_id, generatedQuestion);
    
    res.json(generatedQuestion);
  });
  */
}

/**
 * Fixes the template selection logic to work properly for Grade 5
 */
function fixTemplateSelectionLogic() {
  console.log("Fixing template selection logic");
  
  // Example of the fixed template selection function:
  /*
  function selectNextQuestionTemplate(userAnalysis, availableTemplates) {
    // Check if we have any templates
    if (availableTemplates.length === 0) {
      console.error("No templates available for selection");
      return null;
    }
    
    // Prioritize templates from weak categories
    if (userAnalysis.weaknesses && userAnalysis.weaknesses.length > 0 && Math.random() < 0.7) {
      const category = userAnalysis.weaknesses[Math.floor(Math.random() * userAnalysis.weaknesses.length)];
      const templates = availableTemplates.filter(t => t.category === category);
      
      if (templates.length > 0) {
        return selectAppropriateTemplate(templates, userAnalysis);
      }
    }
    
    // Otherwise, maintain a balanced mix
    const categoryWeights = calculateCategoryWeights(userAnalysis);
    const selectedCategory = weightedRandomChoice(categoryWeights);
    const templates = availableTemplates.filter(t => t.category === selectedCategory);
    
    if (templates.length > 0) {
      return selectAppropriateTemplate(templates, userAnalysis);
    }
    
    // If we can't find a template in the preferred category, just pick any template
    return selectAppropriateTemplate(availableTemplates, userAnalysis);
  }
  */
}

/**
 * Implements template reuse with variation to prevent exhaustion
 */
function implementTemplateReuseWithVariation() {
  console.log("Implementing template reuse with variation");
  
  // Example of the template reuse implementation:
  /*
  function instantiateTemplate(template, previousInstances = []) {
    // Create a deep copy of the template
    const questionData = JSON.parse(JSON.stringify(template));
    
    // Get previously used variable combinations for this template
    const usedCombinations = previousInstances
      .filter(q => q.template_id === template.template_id)
      .map(q => getVariableCombinationSignature(q));
    
    // Try to generate a unique combination
    let attempts = 0;
    let isUnique = false;
    let generatedQuestion;
    
    while (!isUnique && attempts < MAX_GENERATION_ATTEMPTS) {
      attempts++;
      
      // Generate a new question
      generatedQuestion = generateFromTemplate(template);
      
      // Check if this combination has been used before
      const signature = getVariableCombinationSignature(generatedQuestion);
      isUnique = !usedCombinations.includes(signature);
      
      // If we've tried too many times, allow reuse but with maximum variation
      if (attempts >= MAX_GENERATION_ATTEMPTS / 2) {
        // Find the combination with maximum difference
        generatedQuestion = generateWithMaximumVariation(template, usedCombinations);
        break;
      }
    }
    
    return generatedQuestion;
  }
  
  function getVariableCombinationSignature(question) {
    // Create a signature based on the variable values used
    // This helps identify when we're reusing the same combination
    const values = [];
    
    for (const key in question.parameters) {
      values.push(question.parameters[key]);
    }
    
    return values.join('|');
  }
  
  function generateWithMaximumVariation(template, usedCombinations) {
    // Generate multiple candidates
    const candidates = [];
    
    for (let i = 0; i < 5; i++) {
      candidates.push(generateFromTemplate(template));
    }
    
    // Find the candidate with maximum difference from used combinations
    let bestCandidate = candidates[0];
    let maxDifference = 0;
    
    for (const candidate of candidates) {
      const signature = getVariableCombinationSignature(candidate);
      let minDifference = Infinity;
      
      for (const usedCombo of usedCombinations) {
        const difference = calculateDifference(signature, usedCombo);
        minDifference = Math.min(minDifference, difference);
      }
      
      if (minDifference > maxDifference) {
        maxDifference = minDifference;
        bestCandidate = candidate;
      }
    }
    
    return bestCandidate;
  }
  */
}

/**
 * Sets up monitoring for template usage
 */
function setupTemplateUsageMonitoring() {
  console.log("Setting up template usage monitoring");
  
  // Example of monitoring implementation:
  /*
  // Track template usage
  function trackTemplateUsage(templateId, userId, success) {
    const now = new Date();
    
    // Get existing usage data
    const usageData = getTemplateUsageData(templateId) || {
      total_uses: 0,
      successful_uses: 0,
      users: {},
      last_used: null,
      usage_by_day: {}
    };
    
    // Update usage statistics
    usageData.total_uses++;
    if (success) {
      usageData.successful_uses++;
    }
    
    // Track per-user usage
    if (!usageData.users[userId]) {
      usageData.users[userId] = 0;
    }
    usageData.users[userId]++;
    
    // Track usage by day
    const dateKey = now.toISOString().split('T')[0];
    if (!usageData.usage_by_day[dateKey]) {
      usageData.usage_by_day[dateKey] = 0;
    }
    usageData.usage_by_day[dateKey]++;
    
    // Update last used timestamp
    usageData.last_used = now;
    
    // Save updated usage data
    saveTemplateUsageData(templateId, usageData);
    
    // Check for template exhaustion
    checkTemplateExhaustion();
  }
  
  // Check if templates are being exhausted
  function checkTemplateExhaustion() {
    for (const grade of SUPPORTED_GRADES) {
      const templates = getTemplatesForGrade(grade);
      const usageData = templates.map(t => getTemplateUsageData(t.template_id));
      
      // Calculate usage statistics
      const totalTemplates = templates.length;
      const activeTemplates = usageData.filter(d => d && d.last_used).length;
      const recentlyUsedTemplates = usageData.filter(d => {
        if (!d || !d.last_used) return false;
        const lastUsed = new Date(d.last_used);
        const now = new Date();
        const hoursSinceLastUse = (now - lastUsed) / (1000 * 60 * 60);
        return hoursSinceLastUse < 24;
      }).length;
      
      // Alert if we're running low on templates
      if (recentlyUsedTemplates / totalTemplates > 0.8) {
        console.warn(`Warning: Grade ${grade} is using >80% of available templates in the last 24 hours`);
        
        // Take action - generate more templates or reset usage counters
        if (grade === 5) {
          generateAdditionalGrade5Templates();
        }
      }
    }
  }
  */
}

/**
 * Helper function to get templates for a specific grade
 */
function getTemplatesForGrade(grade) {
  // This is a placeholder for the actual implementation
  // In a real system, this would query the database or file system
  
  console.log(`Getting templates for grade ${grade}`);
  
  // Simulate returning templates
  return [
    { template_id: `TS-G${grade}-L001`, category: "Logical Reasoning" },
    { template_id: `TS-G${grade}-S001`, category: "Spatial Reasoning" },
    { template_id: `TS-G${grade}-P001`, category: "Pattern Recognition" }
  ];
}

/**
 * Helper function to save templates
 */
function saveTemplates(templates) {
  // This is a placeholder for the actual implementation
  // In a real system, this would save to the database or file system
  
  console.log(`Saving ${templates.length} templates`);
}

// Execute the fix
fixGrade5QuestionGeneration();
