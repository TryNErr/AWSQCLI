# Grade 5 Thinking Skills Question Auto-Generation Fix

## Issue Diagnosis

After analyzing the auto-generation system for Grade 5 thinking skills questions, I've identified several potential issues that could be causing the failure to generate new questions:

1. **Missing Grade 5 Templates**: The system has templates for Grade 6 but may be missing Grade 5-specific templates.

2. **Template Exhaustion**: The system might be trying to avoid repetition by not reusing templates, but has exhausted all available Grade 5 templates.

3. **Grade Level Filter**: The API endpoint may be filtering for Grade 6 (`grade_level: 6`) without proper handling for Grade 5.

4. **Question Pool Depletion**: The pre-generated cache of Grade 5 questions may be depleted without a mechanism to replenish it.

5. **Validation Failures**: Generated questions might be failing validation checks specific to Grade 5 content.

## Immediate Fix Implementation

### 1. Add Grade 5 Template Support

```javascript
// Add Grade 5 specific template identifiers
const GRADE_TEMPLATES = {
  5: ["TS-G5-L001", "TS-G5-S001", "TS-G5-P001", "TS-G5-C001", "TS-G5-D001"],
  6: ["TS-G6-L001", "TS-G6-S001", "TS-G6-P001", "TS-G6-C001", "TS-G6-D001"]
};

// Update template selection function
function selectTemplateForGrade(grade, category) {
  if (!GRADE_TEMPLATES[grade]) {
    console.error(`No templates defined for grade ${grade}`);
    // Fallback to closest available grade
    grade = findClosestGradeWithTemplates(grade);
  }
  
  const availableTemplates = GRADE_TEMPLATES[grade].filter(
    templateId => getTemplateCategory(templateId) === category
  );
  
  return availableTemplates.length > 0 
    ? availableTemplates[Math.floor(Math.random() * availableTemplates.length)]
    : null;
}
```

### 2. Create Grade 5 Templates

```json
{
  "template_id": "TS-G5-L001",
  "category": "Logical Reasoning",
  "grade_level": 5,
  "difficulty": 2,
  "structure": {
    "scenario": "The {transport_type} journey from {start_location} to {end_location} stops at {num_stations} other stations along the way. {person_name} boarded the {transport_type} at {start_location} and got off at the {position_description}.",
    "clues": [
      "{station1} station is located between {station2} and {station3}.",
      "The {transport_type} stops at {station2} before {station4}.",
      "The {transport_type} stops at {station4} before {station3}."
    ],
    "question": "Which station did {person_name} get off at?",
    "options": [
      "{station4}",
      "{station1}",
      "{station2}",
      "{station3}"
    ]
  },
  "variable_pools": {
    "transport_type": ["train", "bus", "tram"],
    "location_themes": [
      {
        "theme": "cities",
        "locations": ["Greenville", "Sunnydale", "Brookside", "Lakewood", "Hillcrest", "Meadowbrook"]
      }
    ],
    "person_names": ["Alex", "Jamie", "Taylor", "Jordan", "Casey", "Riley"],
    "position_descriptions": {
      "second-last station": 4,
      "third station": 2,
      "fourth station": 3
    }
  }
}
```

### 3. Fix API Endpoint to Support Grade 5

```javascript
// Update API endpoint to properly handle Grade 5
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
  const generatedQuestion = instantiateTemplate(selectedTemplate);
  
  // Add to question pool and return
  addToQuestionPool(user_id, session_id, generatedQuestion);
  
  res.json(generatedQuestion);
});
```

### 4. Implement Template Reuse with Variation

```javascript
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
```

### 5. Add Automatic Template Generation for Grade 5

```javascript
function createGrade5Templates() {
  // Base templates from Grade 6
  const grade6Templates = getTemplatesForGrade(6);
  
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
  
  return grade5Templates;
}
```

## Long-term Solutions

### 1. Grade-Specific Template Management

Implement a proper template management system that:
- Maintains separate template pools for each grade
- Tracks template usage statistics by grade
- Automatically adjusts template difficulty based on grade level

### 2. Dynamic Template Generation

Create a system that can dynamically generate new templates:
- Analyze existing templates to understand their structure
- Generate new variations with different contexts but similar logical structures
- Test generated templates for validity before adding them to the pool

### 3. Cross-Grade Template Adaptation

Implement algorithms to adapt templates between grades:
- Scale difficulty up or down based on grade level
- Adjust language complexity appropriately
- Modify the number of logical steps required to solve

### 4. Monitoring and Alerts

Add monitoring to detect and address template exhaustion:
- Track template usage rates
- Alert when template pools for any grade fall below thresholds
- Automatically trigger template generation when needed

### 5. User Feedback Integration

Incorporate user feedback to improve template quality:
- Track which generated questions receive negative feedback
- Identify patterns in problematic templates
- Automatically adjust or retire templates that consistently perform poorly

## Implementation Plan

1. **Immediate (1-2 days)**:
   - Deploy the API endpoint fix to properly handle Grade 5
   - Add basic Grade 5 templates converted from Grade 6

2. **Short-term (1 week)**:
   - Implement template reuse with variation
   - Add monitoring for template usage
   - Create Grade 5-specific variable pools

3. **Medium-term (2-4 weeks)**:
   - Develop the automatic template generation system
   - Implement cross-grade template adaptation
   - Add comprehensive template validation

4. **Long-term (1-3 months)**:
   - Build the dynamic template generation system
   - Integrate user feedback mechanisms
   - Develop analytics for template performance
