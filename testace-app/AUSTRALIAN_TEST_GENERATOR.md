# Australian Test Generator

## Overview

The Australian Test Generator creates authentic test sets from your available question pool following official Australian academic test formats. It supports both **Opportunity Class Tests** (Years 4-5) and **Selective School Tests** (Years 6-12) with proper difficulty distribution and section organization.

## Features

✅ **Authentic Test Formats**: Follows official Australian test structures  
✅ **Smart Question Selection**: Prioritizes unseen questions and maintains difficulty balance  
✅ **Multiple Grade Levels**: Supports Years 4-10  
✅ **Section-Based Organization**: Thinking Skills, Reading, Mathematics, English  
✅ **Progress Tracking**: Excludes already mastered questions  
✅ **Validation System**: Checks question availability before test generation  

## Test Formats

### Opportunity Class Test
- **Target**: Years 4-5 (gifted students)
- **Duration**: 2 hours 45 minutes (165 minutes)
- **Total Questions**: 40
- **Sections**: 4 sections × 10 questions each
- **Difficulty**: 30% Easy, 50% Medium, 20% Hard

### Selective School Test
- **Target**: Years 6-12 (selective high schools)
- **Duration**: 3 hours (180 minutes)
- **Total Questions**: 50
- **Sections**: 4 sections with varying question counts
- **Difficulty**: 24% Easy, 48% Medium, 28% Hard

## Question Availability

Based on your current question pool of **36,702 questions**:

| Grade | Thinking Skills | Reading | Mathematics | English | Total |
|-------|----------------|---------|-------------|---------|-------|
| Year 4 | 487 | 578 | 1,425 | 497 | **2,987** |
| Year 5 | 570 | 552 | 1,193 | 719 | **3,034** |
| Year 6 | 551 | 592 | 1,261 | 851 | **3,255** |
| Year 7 | 597 | 628 | 1,374 | 758 | **3,357** |
| Year 8 | 559 | 593 | 1,245 | 699 | **3,096** |
| Year 9 | 580 | 599 | 1,024 | 641 | **2,844** |
| Year 10 | 530 | 523 | 1,191 | 720 | **2,964** |

**✅ All test formats can be generated successfully for all grade levels!**

## Usage

### Frontend Integration

The Australian Test Generator is already integrated into the TestAce frontend:

1. **Navigate to Australian Test**: `/australian-test`
2. **Select Grade Level**: Choose from Years 4-10
3. **Choose Test Format**: Opportunity Class or Selective School
4. **Validation Check**: System validates question availability
5. **Start Test**: Generate and begin the test session

### API Endpoints

#### Generate Test
```http
POST /api/australian-test/generate
Content-Type: application/json

{
  "format": "opportunity-class",
  "grade": "5",
  "excludeQuestions": ["question_id_1", "question_id_2"]
}
```

#### Validate Test Generation
```http
POST /api/australian-test/validate
Content-Type: application/json

{
  "format": "selective-school",
  "grade": "7"
}
```

#### Get Available Formats
```http
GET /api/australian-test/formats
```

### Frontend Service Usage

```typescript
import AustralianTestGenerator from '../services/australianTestGenerator';

// Generate a test
const test = await AustralianTestGenerator.generateTest(
  'opportunity-class', 
  '5', 
  excludedQuestionIds
);

// Validate before generation
const validation = AustralianTestGenerator.validateTestGeneration(
  'selective-school', 
  '7'
);

// Check question availability
const counts = AustralianTestGenerator.getAvailableQuestionCounts('6');
```

## Implementation Details

### Question Selection Algorithm

1. **Grade Filtering**: Filter questions by selected grade level
2. **Subject Mapping**: Map question subjects to test sections
3. **Difficulty Distribution**: Select questions according to format requirements
4. **Progress Tracking**: Exclude already correctly answered questions
5. **Randomization**: Shuffle questions within each difficulty level
6. **Final Assembly**: Combine sections and randomize final order

### Subject Mapping

The system maps question subjects to Australian test sections:

```typescript
const subjectMapping = {
  'thinking_skills': 'thinking-skills',
  'mathematical-reasoning': 'thinking-skills',
  'reading': 'reading',
  'math': 'math',
  'mathematics': 'math',
  'english': 'english'
};
```

### Difficulty Distribution

#### Opportunity Class Test (40 questions)
- **Each Section (10 questions)**: 3 Easy, 5 Medium, 2 Hard

#### Selective School Test (50 questions)
- **Thinking Skills (13 questions)**: 3 Easy, 6 Medium, 4 Hard
- **Reading (12 questions)**: 3 Easy, 6 Medium, 3 Hard
- **Mathematics (13 questions)**: 3 Easy, 6 Medium, 4 Hard
- **English (12 questions)**: 3 Easy, 6 Medium, 3 Hard

## Testing

Run the test analysis script to verify question availability:

```bash
cd testace-app
node test-australian-generator.js
```

This will show:
- Question counts by grade and subject
- Difficulty distribution analysis
- Test generation validation for all formats
- Success rate summary

## Files Structure

```
testace-app/
├── frontend/src/services/
│   └── australianTestGenerator.ts          # Main generator service
├── frontend/src/pages/Practice/
│   ├── AustralianQuickTest.tsx             # Test selection page
│   ├── AustralianTestSession.tsx           # Test session page
│   └── AustralianTestResults.tsx           # Results page
├── backend/src/routes/
│   └── australianTest.ts                   # API endpoints
├── test-australian-generator.js            # Test analysis script
└── AUSTRALIAN_TEST_GENERATOR.md            # This documentation
```

## Benefits

1. **Authentic Practice**: Students practice with real Australian test formats
2. **Adaptive Learning**: System prioritizes unseen questions for continuous learning
3. **Comprehensive Coverage**: All subjects and difficulty levels represented
4. **Progress Tracking**: Tracks mastery and adjusts question selection
5. **Scalable**: Can easily add new test formats or modify existing ones
6. **Quality Assurance**: Validation ensures sufficient questions before generation

## Future Enhancements

- **Custom Test Creation**: Allow teachers to create custom test formats
- **Performance Analytics**: Track performance by section and difficulty
- **Adaptive Difficulty**: Adjust difficulty based on student performance
- **Time Management**: Add section-specific time limits
- **Question Tagging**: Enhanced categorization for better selection

---

**Ready to use!** The Australian Test Generator is fully integrated and ready to create authentic test experiences for your students. 🇦🇺📚
