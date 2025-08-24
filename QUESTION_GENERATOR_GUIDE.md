# 🤖 Ollama Question Generator for TestAce

A comprehensive system that uses your local Ollama model to generate diverse, high-quality questions for the TestAce educational platform, eliminating duplicate questions and creating engaging content across all subjects, grades, and difficulty levels.

## 🎯 Features

- **AI-Powered Generation**: Uses your local DeepSeek-R1 Ollama model for intelligent question creation
- **Comprehensive Coverage**: Supports all subjects (Math, English, Reading, Mathematical Reasoning, Thinking Skills)
- **Grade-Appropriate**: Tailored content for grades 1-12
- **Difficulty Scaling**: Easy, Medium, and Hard difficulty levels with appropriate complexity
- **Quality Assurance**: Built-in validation and formatting
- **Backup System**: Automatic backup of existing questions
- **Flexible Targeting**: Generate for specific subjects, grades, or difficulties
- **Educational Focus**: Questions designed to test understanding, not just memorization

## 📋 Supported Subjects

### 📊 Mathematics
- **Easy**: Basic arithmetic, simple fractions, geometry recognition
- **Medium**: Multi-step problems, advanced operations, logical reasoning
- **Hard**: Complex algebra, advanced geometry, abstract mathematical thinking

### 📝 English Language
- **Easy**: Basic grammar, vocabulary, sentence structure
- **Medium**: Complex sentences, literary devices, advanced punctuation
- **Hard**: Sophisticated writing techniques, advanced grammar, rhetorical analysis

### 📖 Reading Comprehension
- **Easy**: Short passages, main idea identification, basic inference
- **Medium**: Moderate passages, cause-and-effect, character analysis
- **Hard**: Complex texts, critical analysis, advanced literary concepts

### 🧮 Mathematical Reasoning
- **Easy**: Simple patterns, basic logic, fundamental reasoning
- **Medium**: Multi-step reasoning, spatial relationships, analytical thinking
- **Hard**: Abstract reasoning, complex logical puzzles, creative problem-solving

### 🧠 Thinking Skills
- **Easy**: Basic critical thinking, simple problem-solving, observation
- **Medium**: Decision-making, evaluation skills, systematic thinking
- **Hard**: Advanced critical analysis, creative thinking, sophisticated reasoning

## 🚀 Quick Start

### 1. Test Your Setup
```bash
# Test the generator with a sample
node test_question_generator.js
```

### 2. Generate All Questions (with backup)
```bash
# Generate all questions and backup existing ones
node ollama_question_generator.js --backup
```

### 3. Generate Specific Content
```bash
# Generate only math questions for elementary grades
node ollama_question_generator.js --subjects math --grades 1,2,3,4,5

# Generate easy and medium questions for all subjects
node ollama_question_generator.js --difficulties easy,medium

# Generate specific combination
node ollama_question_generator.js --subjects math,english --grades 5,6 --difficulties easy --backup
```

## 📖 Detailed Usage

### Command Line Options

```bash
node ollama_question_generator.js [OPTIONS]
```

**Options:**
- `--backup` - Backup existing questions before generation
- `--subjects sub1,sub2` - Target specific subjects
- `--grades 1,2,3` - Target specific grades
- `--difficulties easy,medium` - Target specific difficulty levels
- `--help, -h` - Show help message

### Subject Codes
- `math` - Mathematics
- `english` - English Language
- `reading` - Reading Comprehension
- `mathematical-reasoning` - Mathematical Reasoning
- `thinking-skills` - Thinking Skills

### Grade Range
- Grades 1-12 supported
- Content automatically adjusted for age-appropriateness

### Difficulty Levels
- `easy` - Fundamental concepts, basic applications
- `medium` - Intermediate complexity, multi-step problems
- `hard` - Advanced concepts, complex reasoning

## 🎨 Question Quality Features

### Educational Design Principles
- **Age-Appropriate**: Content tailored to cognitive development level
- **Curriculum-Aligned**: Questions match educational standards
- **Real-World Context**: Problems use relatable scenarios
- **Progressive Difficulty**: Smooth progression within difficulty levels
- **Clear Explanations**: Detailed explanations that teach concepts

### Question Structure
Each generated question includes:
```json
{
  "_id": "unique_identifier",
  "content": "Question text with clear, engaging language",
  "type": "multiple_choice",
  "options": ["Four distinct options", "Only one correct", "Plausible distractors", "Educational value"],
  "correctAnswer": "Exact text of correct option",
  "subject": "subject_name",
  "grade": "grade_level",
  "difficulty": "difficulty_level",
  "explanation": "Clear explanation showing reasoning and teaching concepts",
  "_cacheBreaker": "unique_cache_identifier"
}
```

### Quality Assurance
- **Validation**: Automatic validation of JSON structure
- **Uniqueness**: Timestamp-based IDs prevent duplicates
- **Consistency**: Standardized format across all questions
- **Error Handling**: Graceful handling of generation issues

## 🔧 Advanced Usage

### Batch Generation Examples

```bash
# Elementary school math focus
node ollama_question_generator.js --subjects math --grades 1,2,3,4,5 --backup

# Middle school comprehensive
node ollama_question_generator.js --grades 6,7,8 --backup

# High school advanced subjects
node ollama_question_generator.js --subjects mathematical-reasoning,thinking-skills --grades 9,10,11,12 --difficulties medium,hard

# Reading comprehension across all grades
node ollama_question_generator.js --subjects reading --backup

# Easy questions for struggling students
node ollama_question_generator.js --difficulties easy --backup
```

### Integration with TestAce

The generator automatically:
1. **Updates Question Files**: Replaces existing JSON files with new content
2. **Updates Manifest**: Refreshes `manifest.json` with file list and metadata
3. **Updates Version**: Increments `version.json` for cache invalidation
4. **Maintains Structure**: Preserves existing file naming and directory structure

### File Output Location
```
testace-app/frontend/public/questions/
├── 1_easy_math.json
├── 1_medium_math.json
├── 1_hard_math.json
├── 2_easy_english.json
├── ...
├── manifest.json
└── version.json
```

## 🛠️ Troubleshooting

### Common Issues

**Ollama Not Responding**
```bash
# Check if Ollama is running
ollama list

# Restart Ollama if needed
ollama serve
```

**JSON Parsing Errors**
- The generator includes robust error handling
- Failed generations are logged with details
- Partial failures don't stop the entire process

**Memory Issues**
- Large batch generations use significant memory
- Consider generating in smaller batches for very large datasets
- Monitor system resources during generation

### Performance Tips

1. **Batch Size**: Generate in smaller batches for better reliability
2. **System Resources**: Ensure adequate RAM and CPU for Ollama
3. **Network**: Local Ollama eliminates network dependencies
4. **Storage**: Ensure sufficient disk space for question files and backups

## 📊 Expected Output

### Generation Statistics
```
🚀 Starting question generation with Ollama...
📊 Targeting: 5 subjects × 12 grades × 3 difficulties = 180 files

📝 Generating questions for 1_easy_math.json...
🤖 Calling Ollama model...
✅ Generated 10 questions for 1_easy_math.json

...

🎉 Generation complete!
📈 Total files processed: 180
📝 Total questions generated: 1800
```

### File Structure
Each question file contains exactly 10 unique, high-quality questions with:
- Unique identifiers
- Age-appropriate content
- Educational value
- Clear explanations
- Proper formatting

## 🔄 Maintenance

### Regular Updates
- **Weekly**: Generate new questions to maintain freshness
- **Monthly**: Full regeneration with backup for major updates
- **Seasonal**: Update content to reflect current events or curriculum changes

### Quality Monitoring
- Review generated questions periodically
- Adjust prompts based on quality feedback
- Monitor student performance on generated questions

### Backup Management
- Backups are stored with timestamps
- Keep recent backups for rollback capability
- Archive old backups to manage disk space

## 🎓 Educational Impact

### Benefits for Students
- **Variety**: Eliminates repetitive practice
- **Engagement**: Fresh, interesting content
- **Challenge**: Appropriate difficulty progression
- **Learning**: Explanations that teach concepts

### Benefits for Educators
- **Time Saving**: Automated question creation
- **Quality**: Consistent, educational content
- **Flexibility**: Easy customization for specific needs
- **Scalability**: Generate content for any grade or subject

## 🚀 Next Steps

After running the generator:

1. **Test the Application**: Verify questions load correctly in TestAce
2. **Review Quality**: Check a sample of generated questions
3. **Monitor Performance**: Observe student engagement and performance
4. **Iterate**: Adjust generation parameters based on feedback
5. **Schedule Regular Updates**: Set up periodic regeneration

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Ollama documentation for model-specific issues
3. Test with the sample generator first
4. Check system resources and dependencies

---

**Ready to eliminate duplicate questions and create engaging educational content?**

Start with: `node test_question_generator.js`
