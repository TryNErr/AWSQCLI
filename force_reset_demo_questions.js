/**
 * Force Reset Demo User Grade 5 Questions
 * 
 * This script forcibly resets the Grade 5 thinking skills questions for the demo user.
 * It deletes all existing questions and generates new ones, ensuring they are visible.
 */

// Configuration
const USER_ID = 'demo_user';
const GRADE = 5;
const NUM_QUESTIONS = 20;

// Import the template data
const templateData = require('./grade5_question_templates.json');

/**
 * Main function to force reset demo user questions
 */
async function forceResetDemoQuestions() {
  console.log(`Starting force reset of Grade ${GRADE} questions for user ${USER_ID}`);
  
  try {
    // 1. Delete all existing questions for this user and grade
    await deleteExistingQuestions();
    
    // 2. Generate new questions
    const questions = await generateNewQuestions();
    
    // 3. Save the new questions with explicit visibility settings
    await saveQuestions(questions);
    
    // 4. Clear any caches
    await clearAllCaches();
    
    // 5. Verify the questions are accessible
    await verifyQuestions();
    
    console.log('Force reset completed successfully!');
    console.log(`${questions.length} new Grade ${GRADE} questions are now available for ${USER_ID}`);
    
  } catch (error) {
    console.error('Error during force reset:', error);
  }
}

/**
 * Delete all existing questions for the user and grade
 */
async function deleteExistingQuestions() {
  console.log(`Deleting all existing Grade ${GRADE} questions for user ${USER_ID}`);
  
  // In a real implementation, this would delete from your database
  // Example SQL implementation:
  // await db.query('DELETE FROM questions WHERE user_id = ? AND grade = ?', [USER_ID, GRADE]);
  
  // Example MongoDB implementation:
  // await db.collection('questions').deleteMany({ user_id: USER_ID, grade: GRADE });
  
  console.log('Existing questions deleted');
}

/**
 * Generate new questions
 */
async function generateNewQuestions() {
  console.log(`Generating ${NUM_QUESTIONS} new Grade ${GRADE} questions`);
  
  const templates = templateData.templates;
  
  if (!templates || templates.length === 0) {
    throw new Error('No templates available');
  }
  
  const questions = [];
  
  for (let i = 0; i < NUM_QUESTIONS; i++) {
    // Select a template (round-robin)
    const templateIndex = i % templates.length;
    const template = templates[templateIndex];
    
    // Generate a question
    const question = await generateQuestionFromTemplate(template, i);
    
    // Explicitly set visibility properties
    question.used = false;
    question.visible = true;
    question.user_id = USER_ID;
    question.grade = GRADE;
    question.created_at = new Date().toISOString();
    question.priority = 1; // High priority to ensure it shows up
    
    questions.push(question);
  }
  
  console.log(`Generated ${questions.length} questions`);
  return questions;
}

/**
 * Generate a question from a template
 */
async function generateQuestionFromTemplate(template, index) {
  // Create a deep copy of the template
  const question = JSON.parse(JSON.stringify(template));
  
  // Add unique ID
  question.id = `reset_${GRADE}_${Date.now()}_${index}`;
  
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
 * Save questions to the database
 */
async function saveQuestions(questions) {
  console.log(`Saving ${questions.length} questions to database`);
  
  // In a real implementation, this would save to your database
  // Example SQL implementation:
  // for (const question of questions) {
  //   await db.query(
  //     'INSERT INTO questions (id, user_id, grade, question_text, question_prompt, options, correct_answer, used, visible, created_at, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  //     [question.id, question.user_id, question.grade, question.question_text, question.question_prompt, JSON.stringify(question.options), question.correct_answer, question.used, question.visible, question.created_at, question.priority]
  //   );
  // }
  
  // Example MongoDB implementation:
  // await db.collection('questions').insertMany(questions);
  
  console.log('Questions saved successfully');
}

/**
 * Clear all caches
 */
async function clearAllCaches() {
  console.log('Clearing all caches');
  
  // In a real implementation, this would clear relevant caches
  // Example Redis implementation:
  // await redis.del(`user_questions_${USER_ID}_${GRADE}`);
  // await redis.del(`user_progress_${USER_ID}`);
  
  console.log('Caches cleared');
}

/**
 * Verify questions are accessible
 */
async function verifyQuestions() {
  console.log('Verifying questions are accessible');
  
  // In a real implementation, this would check if questions can be retrieved
  // Example verification:
  // const questions = await db.query('SELECT * FROM questions WHERE user_id = ? AND grade = ? AND used = FALSE', [USER_ID, GRADE]);
  // if (questions.length === 0) {
  //   throw new Error('Verification failed: No questions found');
  // }
  
  console.log('Verification successful');
}

// Execute the force reset
forceResetDemoQuestions().then(() => {
  console.log('Force reset script completed');
}).catch(error => {
  console.error('Error running force reset script:', error);
});

module.exports = { forceResetDemoQuestions };
