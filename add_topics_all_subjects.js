const fs = require('fs');
const path = require('path');

function getTopicFromContent(content, subject, grade) {
  const lowerContent = content.toLowerCase();
  
  if (subject === 'english') {
    if (lowerContent.includes('part of speech') || lowerContent.includes('noun') || lowerContent.includes('verb') || lowerContent.includes('adjective') || lowerContent.includes('adverb')) return 'Parts of Speech';
    if (lowerContent.includes('synonym') || lowerContent.includes('antonym')) return 'Vocabulary';
    if (lowerContent.includes('sentence') || lowerContent.includes('fragment')) return 'Sentence Structure';
    if (lowerContent.includes('punctuation') || lowerContent.includes('comma') || lowerContent.includes('period')) return 'Punctuation';
    if (lowerContent.includes('spelling')) return 'Spelling';
    if (lowerContent.includes('tense') || lowerContent.includes('past') || lowerContent.includes('present') || lowerContent.includes('future')) return 'Grammar - Tenses';
    if (lowerContent.includes('plural') || lowerContent.includes('singular')) return 'Grammar - Number';
    if (lowerContent.includes('subject') || lowerContent.includes('predicate')) return 'Sentence Parts';
    if (lowerContent.includes('metaphor') || lowerContent.includes('simile') || lowerContent.includes('alliteration')) return 'Literary Devices';
    return 'Grammar';
  }
  
  if (subject === 'reading') {
    if (lowerContent.includes('main idea') || lowerContent.includes('central idea')) return 'Main Idea';
    if (lowerContent.includes('detail') || lowerContent.includes('supporting')) return 'Supporting Details';
    if (lowerContent.includes('inference') || lowerContent.includes('infer') || lowerContent.includes('conclude')) return 'Inference';
    if (lowerContent.includes('author') && (lowerContent.includes('purpose') || lowerContent.includes('intent'))) return 'Author\'s Purpose';
    if (lowerContent.includes('tone') || lowerContent.includes('mood')) return 'Tone and Mood';
    if (lowerContent.includes('sequence') || lowerContent.includes('order') || lowerContent.includes('first') || lowerContent.includes('next')) return 'Sequence';
    if (lowerContent.includes('cause') || lowerContent.includes('effect') || lowerContent.includes('because') || lowerContent.includes('result')) return 'Cause and Effect';
    if (lowerContent.includes('compare') || lowerContent.includes('contrast') || lowerContent.includes('similar') || lowerContent.includes('different')) return 'Compare and Contrast';
    if (lowerContent.includes('character') || lowerContent.includes('protagonist')) return 'Character Analysis';
    if (lowerContent.includes('setting') || lowerContent.includes('where') || lowerContent.includes('when')) return 'Setting';
    if (lowerContent.includes('plot') || lowerContent.includes('story')) return 'Plot';
    if (lowerContent.includes('fact') || lowerContent.includes('opinion')) return 'Fact vs Opinion';
    return 'Reading Comprehension';
  }
  
  if (subject === 'thinking-skills') {
    if (lowerContent.includes('logic') || lowerContent.includes('logical') || lowerContent.includes('reasoning')) return 'Logical Reasoning';
    if (lowerContent.includes('pattern') || lowerContent.includes('sequence') || lowerContent.includes('next')) return 'Pattern Recognition';
    if (lowerContent.includes('problem') && lowerContent.includes('solve')) return 'Problem Solving';
    if (lowerContent.includes('critical') || lowerContent.includes('analyze') || lowerContent.includes('evaluate')) return 'Critical Thinking';
    if (lowerContent.includes('cause') || lowerContent.includes('effect')) return 'Cause and Effect';
    if (lowerContent.includes('classify') || lowerContent.includes('category') || lowerContent.includes('group')) return 'Classification';
    if (lowerContent.includes('compare') || lowerContent.includes('contrast')) return 'Comparison';
    if (lowerContent.includes('assumption') || lowerContent.includes('conclude') || lowerContent.includes('inference')) return 'Making Inferences';
    if (lowerContent.includes('decision') || lowerContent.includes('choose') || lowerContent.includes('best')) return 'Decision Making';
    if (lowerContent.includes('creative') || lowerContent.includes('imagine') || lowerContent.includes('brainstorm')) return 'Creative Thinking';
    return 'Critical Thinking';
  }
  
  if (subject === 'mathematical-reasoning') {
    if (lowerContent.includes('proof') || lowerContent.includes('prove')) return 'Mathematical Proof';
    if (lowerContent.includes('pattern') || lowerContent.includes('sequence')) return 'Patterns and Sequences';
    if (lowerContent.includes('logic') || lowerContent.includes('logical')) return 'Mathematical Logic';
    if (lowerContent.includes('problem') && lowerContent.includes('solve')) return 'Problem Solving';
    if (lowerContent.includes('reasoning') || lowerContent.includes('justify')) return 'Mathematical Reasoning';
    return 'Mathematical Thinking';
  }
  
  return 'General';
}

const questionsDir = '/workspaces/AWSQCLI/testace-app/frontend/public/questions';
const files = fs.readdirSync(questionsDir).filter(f => f.endsWith('.json') && f !== 'version.json');

files.forEach(filename => {
  const filePath = path.join(questionsDir, filename);
  const grade = parseInt(filename.split('_')[0]);
  
  try {
    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (Array.isArray(questions) && questions.length > 0) {
      const subject = questions[0].subject;
      
      const updatedQuestions = questions.map(q => {
        if (!q.topic) {
          q.topic = getTopicFromContent(q.content, subject, grade);
        }
        return q;
      });
      
      fs.writeFileSync(filePath, JSON.stringify(updatedQuestions, null, 2));
      console.log(`Updated ${filename} with topics (${subject})`);
    }
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
  }
});

console.log('All question files updated with topics!');
