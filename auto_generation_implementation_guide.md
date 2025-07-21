# Thinking Skills Question Auto-Generation Implementation Guide

This guide explains how to implement the fully automated thinking skills question generation system for the TestAce app. The system will automatically generate new questions when users have answered existing ones, without requiring any manual intervention.

## 1. System Overview

The auto-generation system consists of:

1. **Template Management**: A database of question templates organized by grade and thinking skill category
2. **Question Generation Engine**: Logic to create unique questions from templates
3. **User Question Pool**: A per-user cache of generated questions
4. **Automatic Replenishment**: Background processes that maintain question pools
5. **API Integration**: Endpoints to serve questions to the app

## 2. Implementation Steps

### Step 1: Add the Auto-Generation System to Your Project

1. Copy the `auto_question_generation_system.js` file to your project
2. Import it in your main application file:

```javascript
import autoQuestionGenerator from './auto_question_generation_system.js';
```

### Step 2: Connect to Your Database

Replace the database simulation methods in the `AutoQuestionGenerator` class with actual database calls:

```javascript
async fetchTemplatesFromDatabase(grade) {
  try {
    // Replace with your actual database query
    const templates = await db.collection('templates')
      .where('grade_level', '==', grade)
      .get()
      .then(snapshot => snapshot.docs.map(doc => doc.data()));
    
    return templates;
  } catch (error) {
    console.error(`Error fetching templates for grade ${grade}:`, error);
    return [];
  }
}

async saveTemplatesToDatabase(grade, templates) {
  try {
    // Use a batch write for efficiency
    const batch = db.batch();
    
    for (const template of templates) {
      const docRef = db.collection('templates').doc(template.template_id);
      batch.set(docRef, template);
    }
    
    await batch.commit();
    console.log(`Saved ${templates.length} templates for grade ${grade}`);
  } catch (error) {
    console.error(`Error saving templates for grade ${grade}:`, error);
  }
}

// Similarly update other database methods
```

### Step 3: Import Initial Templates

1. Import the Grade 5 templates from `grade5_question_templates.json`:

```javascript
import fs from 'fs';

async function importInitialTemplates() {
  try {
    // Read the template file
    const templateData = fs.readFileSync('./grade5_question_templates.json', 'utf8');
    const templates = JSON.parse(templateData).templates;
    
    // Save to database
    await autoQuestionGenerator.saveTemplatesToDatabase(5, templates);
    console.log(`Imported ${templates.length} Grade 5 templates`);
  } catch (error) {
    console.error('Error importing initial templates:', error);
  }
}

// Call this function during app initialization
importInitialTemplates();
```

### Step 4: Update Your API Endpoints

Modify your question API endpoints to use the auto-generation system:

```javascript
// API endpoint to get questions for a user
app.get('/api/questions/:userId/:grade', async (req, res) => {
  try {
    const { userId, grade } = req.params;
    const gradeNum = parseInt(grade, 10);
    
    // Ensure question pool exists
    autoQuestionGenerator.ensureQuestionPoolForUser(userId, gradeNum);
    
    // Get available questions
    const poolKey = `${userId}_${gradeNum}`;
    const pool = autoQuestionGenerator.questionPools[poolKey] || [];
    const availableQuestions = pool.filter(q => !q.used);
    
    // Return questions
    res.json({
      success: true,
      questions: availableQuestions.slice(0, 10) // Return up to 10 questions
    });
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({ success: false, error: 'Failed to get questions' });
  }
});

// API endpoint to mark a question as answered
app.post('/api/questions/:userId/answered', async (req, res) => {
  try {
    const { userId } = req.params;
    const { questionId, isCorrect, grade } = req.body;
    
    // Mark question as used
    autoQuestionGenerator.markQuestionAsUsed(userId, questionId);
    
    // Track performance (for adaptive question selection)
    // Your performance tracking code here
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking question as answered:', error);
    res.status(500).json({ success: false, error: 'Failed to update question status' });
  }
});
```

### Step 5: Set Up Background Processing

Ensure the auto-generation system runs continuously:

1. For server-side applications, initialize the system when your server starts:

```javascript
// In your server initialization code
import autoQuestionGenerator from './auto_question_generation_system.js';

// The constructor automatically starts the system
console.log('Auto question generation system initialized');
```

2. For client-side applications, initialize when the app loads:

```javascript
// In your app initialization code
import autoQuestionGenerator from './auto_question_generation_system.js';

document.addEventListener('DOMContentLoaded', () => {
  // The constructor automatically starts the system
  console.log('Auto question generation system initialized');
});
```

## 3. Customizing the System

### Adding New Templates

To add new templates for any grade:

1. Create a JSON file with your templates following the structure in `grade5_question_templates.json`
2. Import and save them to the database:

```javascript
async function addNewTemplates(grade, templatesFile) {
  try {
    const templateData = fs.readFileSync(templatesFile, 'utf8');
    const templates = JSON.parse(templateData).templates;
    
    await autoQuestionGenerator.saveTemplatesToDatabase(grade, templates);
    console.log(`Added ${templates.length} templates for grade ${grade}`);
  } catch (error) {
    console.error(`Error adding templates for grade ${grade}:`, error);
  }
}
```

### Customizing Question Generation Logic

To customize how questions are generated for specific template types:

1. Extend the template-specific generation methods in the `AutoQuestionGenerator` class:

```javascript
async generateLogicalReasoningQuestion(question, theme) {
  // Your custom logic for logical reasoning questions
  
  if (question.template_id.includes('CUSTOM')) {
    // Custom logic for your specific template
  } else {
    // Fall back to default logic
    super.generateLogicalReasoningQuestion(question, theme);
  }
}
```

## 4. Testing the System

### Manual Testing

1. Start your application
2. Create a test user
3. Have the user answer all available Grade 5 thinking skills questions
4. Verify that new questions are automatically generated
5. Check that the new questions are appropriate for Grade 5

### Automated Testing

Create test scripts to verify:

1. Template loading works for all grades
2. Question generation produces valid questions
3. Question pools are properly replenished
4. Questions aren't duplicated for users

Example test:

```javascript
async function testAutoGeneration() {
  const userId = 'test_user_' + Date.now();
  const grade = 5;
  
  // Ensure question pool
  autoQuestionGenerator.ensureQuestionPoolForUser(userId, grade);
  
  // Get initial questions
  const poolKey = `${userId}_${grade}`;
  const initialPool = autoQuestionGenerator.questionPools[poolKey] || [];
  console.log(`Initial pool size: ${initialPool.length}`);
  
  // Mark all questions as used
  for (const question of initialPool) {
    autoQuestionGenerator.markQuestionAsUsed(userId, question.id);
  }
  
  // Wait for auto-generation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Check if new questions were generated
  const updatedPool = autoQuestionGenerator.questionPools[poolKey] || [];
  const availableQuestions = updatedPool.filter(q => !q.used);
  console.log(`New available questions: ${availableQuestions.length}`);
  
  if (availableQuestions.length > 0) {
    console.log('Auto-generation test passed!');
  } else {
    console.error('Auto-generation test failed - no new questions generated');
  }
}
```

## 5. Monitoring and Maintenance

### Monitoring Template Usage

Add analytics to track:

1. Which templates are used most frequently
2. Which templates have the highest/lowest success rates
3. How many unique variations are generated from each template

### Periodic Template Refresh

Schedule periodic updates to add new templates:

```javascript
// Run once a month
setInterval(() => {
  console.log('Refreshing templates');
  
  // Generate new variations of existing templates
  for (const grade of SUPPORTED_GRADES) {
    autoQuestionGenerator.generateNewTemplateVariations(grade);
  }
}, 30 * 24 * 60 * 60 * 1000); // 30 days
```

## 6. Troubleshooting

### Common Issues and Solutions

1. **No questions being generated**
   - Check if templates exist for the grade level
   - Verify the database connection is working
   - Check for errors in the console logs

2. **Duplicate questions appearing**
   - Check the template variation logic
   - Increase the `TEMPLATE_VARIATION_THRESHOLD`
   - Add more variable pools to templates

3. **Questions too difficult/easy**
   - Adjust the difficulty scaling in `adaptTemplateForGrade`
   - Modify the language simplification/complexification logic

4. **System performance issues**
   - Implement caching for frequently used templates
   - Pre-generate questions during off-peak hours
   - Optimize database queries

## 7. Conclusion

With this implementation, the TestAce app will automatically generate new thinking skills questions for all grade levels without any manual intervention. The system will:

1. Monitor question pools for each user
2. Generate new questions when pools run low
3. Ensure questions are appropriate for each grade level
4. Adapt to user performance by focusing on weak areas
5. Maintain variety by creating unique variations of templates

This creates a seamless experience where users always have fresh questions to answer, regardless of how many they complete.
