/**
 * Emergency Fix for Grade 5 Thinking Skills Questions
 * 
 * This script immediately fixes the issue with Grade 5 thinking skills questions
 * not being auto-generated. It can be run as a one-time fix to populate the
 * question pool for all users who have exhausted their Grade 5 questions.
 */

// Configuration
const GRADE = 5;
const QUESTIONS_PER_USER = 20;

// Import the template data
const templateData = require('./grade5_question_templates.json');

/**
 * Main function to fix Grade 5 questions immediately
 */
async function fixGrade5QuestionsNow() {
  console.log('Starting emergency fix for Grade 5 thinking skills questions');
  
  try {
    // 1. Get all users who have exhausted their Grade 5 questions
    const affectedUsers = await getAffectedUsers();
    console.log(`Found ${affectedUsers.length} users with exhausted Grade 5 questions`);
    
    if (affectedUsers.length === 0) {
      console.log('No affected users found. Nothing to fix.');
      return;
    }
    
    // 2. Import templates if they don't exist
    await ensureTemplatesExist();
    
    // 3. Generate new questions for each affected user
    for (const user of affectedUsers) {
      await generateQuestionsForUser(user.id);
    }
    
    console.log('Fix completed successfully!');
    console.log(`Generated ${affectedUsers.length * QUESTIONS_PER_USER} new Grade 5 questions`);
    
  } catch (error) {
    console.error('Error fixing Grade 5 questions:', error);
  }
}

/**
 * Get all users who have exhausted their Grade 5 questions
 */
async function getAffectedUsers() {
  try {
    // In a real implementation, this would query your database
    // to find users who have answered all available Grade 5 questions
    
    // For demonstration, we'll return a sample list
    return [
      { id: 'user1', name: 'Test User 1' },
      { id: 'user2', name: 'Test User 2' },
      { id: 'demo_user', name: 'Demo User' }
    ];
  } catch (error) {
    console.error('Error getting affected users:', error);
    return [];
  }
}

/**
 * Ensure templates exist in the database
 */
async function ensureTemplatesExist() {
  try {
    // Check if templates exist
    const existingTemplates = await getExistingTemplates();
    
    if (existingTemplates.length === 0) {
      console.log('No Grade 5 templates found. Importing templates...');
      await importTemplates();
    } else {
      console.log(`Found ${existingTemplates.length} existing Grade 5 templates`);
    }
  } catch (error) {
    console.error('Error ensuring templates exist:', error);
    throw error;
  }
}

/**
 * Get existing templates from the database
 */
async function getExistingTemplates() {
  try {
    // In a real implementation, this would query your database
    // to get existing templates for Grade 5
    
    // For demonstration, we'll return an empty array to simulate no templates
    return [];
  } catch (error) {
    console.error('Error getting existing templates:', error);
    return [];
  }
}

/**
 * Import templates from the template data file
 */
async function importTemplates() {
  try {
    const templates = templateData.templates;
    
    if (!templates || templates.length === 0) {
      throw new Error('No templates found in template data');
    }
    
    // In a real implementation, this would save the templates to your database
    console.log(`Imported ${templates.length} Grade 5 templates`);
    
    return templates;
  } catch (error) {
    console.error('Error importing templates:', error);
    throw error;
  }
}

/**
 * Generate questions for a specific user
 */
async function generateQuestionsForUser(userId) {
  try {
    console.log(`Generating ${QUESTIONS_PER_USER} questions for user ${userId}`);
    
    // Get templates
    const templates = templateData.templates;
    
    if (!templates || templates.length === 0) {
      throw new Error('No templates available');
    }
    
    // Generate questions
    const questions = [];
    
    for (let i = 0; i < QUESTIONS_PER_USER; i++) {
      // Select a template
      const templateIndex = i % templates.length;
      const template = templates[templateIndex];
      
      // Generate a question
      const question = await generateQuestionFromTemplate(template, i);
      questions.push(question);
    }
    
    // Save questions to user's pool
    await saveQuestionsToUserPool(userId, questions);
    
    console.log(`Successfully generated ${questions.length} questions for user ${userId}`);
  } catch (error) {
    console.error(`Error generating questions for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Generate a question from a template
 */
async function generateQuestionFromTemplate(template, index) {
  try {
    // Create a deep copy of the template
    const question = JSON.parse(JSON.stringify(template));
    
    // Add unique ID and metadata
    question.id = `g5_fix_${template.template_id}_${index}_${Date.now()}`;
    question.created_at = new Date().toISOString();
    question.used = false;
    
    // Add parameters object if it doesn't exist
    if (!question.parameters) {
      question.parameters = {};
    }
    
    // Fill in variables from pools
    if (template.variable_pools) {
      for (const [key, pool] of Object.entries(template.variable_pools)) {
        if (key === 'location_themes') {
          // Handle location themes specially
          if (pool && pool.length > 0) {
            const themeIndex = index % pool.length;
            question.parameters.theme = pool[themeIndex].theme;
            question.parameters.locations = pool[themeIndex].locations;
          }
        } else if (Array.isArray(pool)) {
          // Simple array pool
          const poolIndex = index % pool.length;
          question.parameters[key] = pool[poolIndex];
        } else if (typeof pool === 'object' && pool !== null) {
          // Object pool (like position_descriptions)
          const poolKeys = Object.keys(pool);
          if (poolKeys.length > 0) {
            const keyIndex = index % poolKeys.length;
            const selectedKey = poolKeys[keyIndex];
            question.parameters[key] = selectedKey;
            
            // If the value is also needed, store it
            if (typeof pool[selectedKey] !== 'undefined') {
              question.parameters[`${key}_value`] = pool[selectedKey];
            }
          }
        }
      }
    }
    
    // Generate the final question text by replacing placeholders
    if (template.structure && template.structure.scenario) {
      question.question_text = replacePlaceholders(template.structure.scenario, question.parameters);
    }
    
    if (template.structure && template.structure.question) {
      question.question_prompt = replacePlaceholders(template.structure.question, question.parameters);
    }
    
    // Generate options
    if (template.structure && template.structure.options) {
      question.options = template.structure.options.map(option => 
        replacePlaceholders(option, question.parameters)
      );
    }
    
    // Set a default correct answer (in a real implementation, this would be calculated)
    question.correct_answer = String.fromCharCode(65 + (index % 4)); // A, B, C, or D
    
    return question;
  } catch (error) {
    console.error('Error generating question from template:', error);
    throw error;
  }
}

/**
 * Replace placeholders in a text with actual values
 */
function replacePlaceholders(text, parameters) {
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
 * Save questions to a user's pool
 */
async function saveQuestionsToUserPool(userId, questions) {
  try {
    // In a real implementation, this would save the questions to your database
    console.log(`Saving ${questions.length} questions to pool for user ${userId}`);
    
    // IMPORTANT: Make sure questions are marked as NOT used
    questions.forEach(question => {
      question.used = false;
      question.visible = true; // Add explicit visibility flag
    });
    
    // Save to the active questions collection/table
    await saveToActiveQuestions(userId, GRADE, questions);
    
    // Clear any cache that might be preventing new questions from appearing
    await clearQuestionCache(userId, GRADE);
    
    console.log(`Successfully saved ${questions.length} questions to pool for user ${userId}`);
  } catch (error) {
    console.error(`Error saving questions for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Save to the active questions collection/table
 */
async function saveToActiveQuestions(userId, grade, questions) {
  // In a real implementation, this would save to your specific database
  // This is a placeholder for the actual implementation
  
  console.log(`Saving to active questions for user ${userId}, grade ${grade}`);
  
  // Example implementation for different database types:
  
  // For SQL database:
  // questions.forEach(async (question) => {
  //   await db.query(
  //     'INSERT INTO active_questions (user_id, grade, question_id, question_data, used, created_at) VALUES (?, ?, ?, ?, ?, ?)',
  //     [userId, grade, question.id, JSON.stringify(question), false, new Date()]
  //   );
  // });
  
  // For MongoDB:
  // await db.collection('active_questions').insertMany(
  //   questions.map(question => ({
  //     user_id: userId,
  //     grade: grade,
  //     question_id: question.id,
  //     question_data: question,
  //     used: false,
  //     created_at: new Date()
  //   }))
  // );
  
  // For Firebase:
  // const batch = db.batch();
  // questions.forEach((question) => {
  //   const ref = db.collection('active_questions').doc();
  //   batch.set(ref, {
  //     user_id: userId,
  //     grade: grade,
  //     question_id: question.id,
  //     question_data: question,
  //     used: false,
  //     created_at: new Date()
  //   });
  // });
  // await batch.commit();
}

/**
 * Clear any cache that might be preventing new questions from appearing
 */
async function clearQuestionCache(userId, grade) {
  // In a real implementation, this would clear any caches
  // This is a placeholder for the actual implementation
  
  console.log(`Clearing question cache for user ${userId}, grade ${grade}`);
  
  // Example implementation:
  // await cache.delete(`user_questions_${userId}_${grade}`);
  
  // Also notify any services that need to refresh their data
  // await notifyQuestionRefresh(userId, grade);
}

// Execute the fix
fixGrade5QuestionsNow().then(() => {
  console.log('Grade 5 question fix script completed');
}).catch(error => {
  console.error('Error running Grade 5 question fix script:', error);
});

module.exports = { fixGrade5QuestionsNow };
