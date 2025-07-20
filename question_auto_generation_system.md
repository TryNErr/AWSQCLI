# Thinking Skills Question Auto-Generation System

## System Architecture

### 1. Question Database Structure
```
{
  "question_id": "TS-G6-L001",
  "category": "Logical Reasoning",
  "sub_category": "Deductive Logic",
  "difficulty": 3,
  "template_id": "LR-DL-001",
  "parameters": {
    "context": {...},
    "options": {...},
    "correct_answer": "B"
  },
  "metadata": {
    "success_rate": 0.65,
    "avg_time_taken": 45,
    "discrimination_index": 0.42
  }
}
```

### 2. Template System

#### Example Template: Logical Sequence (Train/Bus Journey)
```
{
  "template_id": "LR-SEQ-001",
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
    ],
    "solution_logic": "The order is {start_location} → {station2} → {station4} → {station1} → {station3} → {end_location}. The {position_description} is {correct_station}."
  },
  "variable_pools": {
    "transport_type": ["train", "bus", "tram", "ferry"],
    "location_themes": [
      {
        "theme": "cities",
        "locations": ["Oakville", "Riverdale", "Pinewood", "Elmwood", "Cedarwood", "Maplewood"]
      },
      {
        "theme": "countries",
        "locations": ["France", "Spain", "Italy", "Germany", "Belgium", "Netherlands"]
      }
    ],
    "person_names": ["Maya", "Ethan", "Sophia", "Noah", "Emma", "Liam"],
    "position_descriptions": {
      "second-last station": 4,
      "third station": 2,
      "fourth station": 3,
      "last station before the final destination": 4
    }
  }
}
```

#### Example Template: Pattern Recognition
```
{
  "template_id": "PR-SEQ-001",
  "structure": {
    "scenario": "Access to the {context_location} is only possible by answering two security questions. The questions are based on the following sentence:\n{secret_sentence}",
    "mechanism": "Each day everyone is given a number, which is the starting position. When anyone {action_verb} they are given two numbers and have to {response_action} the letters that appear in those positions if counting starts at that day's starting position.",
    "example": "Today, the first person was given the numbers {example_pos1} and {example_pos2} and responded with the letters {example_letter1} and {example_letter2}, which was correct.",
    "question": "The second person was given the numbers {question_pos1} and {question_pos2}. What letters should be given as the response?",
    "solution_logic": "Starting from position {starting_position}, the {question_pos1}th letter is {solution_letter1} and the {question_pos2}th letter is {solution_letter2}."
  },
  "variable_pools": {
    "context_locations": ["online gaming club", "secret laboratory", "virtual escape room", "coding challenge"],
    "secret_sentences": [
      "Digital games require creative thinking",
      "Knowledge unlocks powerful solutions",
      "Science reveals hidden patterns",
      "Technology transforms everyday life"
    ],
    "action_verbs": ["logs in", "arrives", "attempts to enter", "approaches the entrance"],
    "response_actions": ["type", "say", "enter", "write down"]
  }
}
```

## Dynamic Question Generation Algorithm

### 1. User Performance Analysis
```python
def analyze_user_performance(user_id):
    # Retrieve user's question history
    history = get_user_question_history(user_id)
    
    # Calculate performance metrics by category
    performance_by_category = {}
    for attempt in history:
        category = attempt['question_category']
        if category not in performance_by_category:
            performance_by_category[category] = {
                'total': 0,
                'correct': 0,
                'avg_time': 0,
                'attempts': []
            }
        
        performance_by_category[category]['total'] += 1
        if attempt['is_correct']:
            performance_by_category[category]['correct'] += 1
        performance_by_category[category]['avg_time'] += attempt['time_taken']
        performance_by_category[category]['attempts'].append(attempt)
    
    # Calculate success rates and average times
    for category, data in performance_by_category.items():
        if data['total'] > 0:
            data['success_rate'] = data['correct'] / data['total']
            data['avg_time'] = data['avg_time'] / data['total']
    
    # Identify strengths and weaknesses
    strengths = [cat for cat, data in performance_by_category.items() 
                if data['success_rate'] >= 0.7]
    weaknesses = [cat for cat, data in performance_by_category.items() 
                 if data['success_rate'] < 0.5 and data['total'] >= 3]
    
    return {
        'performance_by_category': performance_by_category,
        'strengths': strengths,
        'weaknesses': weaknesses
    }
```

### 2. Question Selection Logic
```python
def select_next_question_template(user_analysis, available_templates):
    # Prioritize templates from weak categories
    if user_analysis['weaknesses'] and random.random() < 0.7:
        category = random.choice(user_analysis['weaknesses'])
        templates = [t for t in available_templates if t['category'] == category]
        if templates:
            return select_appropriate_difficulty(templates, user_analysis)
    
    # Otherwise, maintain a balanced mix
    category_weights = calculate_category_weights(user_analysis)
    selected_category = weighted_random_choice(category_weights)
    templates = [t for t in available_templates if t['category'] == selected_category]
    
    return select_appropriate_difficulty(templates, user_analysis)
```

### 3. Template Instantiation
```python
def instantiate_template(template):
    # Create a deep copy of the template
    question_data = copy.deepcopy(template)
    
    # Select theme if applicable
    if 'variable_pools' in template and 'location_themes' in template['variable_pools']:
        theme = random.choice(template['variable_pools']['location_themes'])
        
    # Fill in variables from pools
    for field, pool in template['variable_pools'].items():
        if isinstance(pool, list):
            question_data[field] = random.choice(pool)
    
    # Apply specific logic based on template type
    if template['template_id'].startswith('LR-SEQ'):
        question_data = generate_sequence_question(question_data, theme)
    elif template['template_id'].startswith('PR-SEQ'):
        question_data = generate_pattern_question(question_data)
    
    # Validate the generated question
    validate_question(question_data)
    
    return question_data
```

## Implementation Plan

### Phase 1: Foundation
1. Build the question database with initial set of templates
2. Implement basic template instantiation
3. Create simple user performance tracking

### Phase 2: Enhanced Generation
1. Implement adaptive difficulty adjustment
2. Add more sophisticated template types
3. Develop validation system for generated questions

### Phase 3: Advanced Personalization
1. Implement machine learning for question selection
2. Add natural language generation for more varied question text
3. Develop analytics dashboard for teachers/parents

## Integration with TestAce App

### API Endpoints
```
POST /api/questions/generate
{
  "user_id": "user123",
  "grade_level": 6,
  "session_id": "session456",
  "previous_questions": ["q1", "q2", "q3"],
  "performance_data": {...}
}

Response:
{
  "question_id": "gen123",
  "question_text": "...",
  "options": [...],
  "metadata": {...}
}
```

### Real-time Generation Flow
1. User completes a question in the app
2. App sends performance data to the server
3. Server analyzes user performance and selects appropriate template
4. Server generates new question and returns it to the app
5. App presents the new question to the user

### Caching Strategy
- Pre-generate a pool of questions for each user session
- Refresh the pool when it falls below threshold
- Cache common question templates for faster generation

## Evaluation Metrics

1. **Question Quality**
   - Difficulty accuracy (% of questions at intended difficulty level)
   - Discrimination index (how well questions differentiate skill levels)
   - User feedback ratings

2. **Learning Effectiveness**
   - Improvement in weak areas over time
   - Knowledge retention (performance on similar questions over time)
   - Time to mastery of specific skills

3. **System Performance**
   - Generation time per question
   - User wait time
   - System resource utilization
