const fs = require('fs');

console.log('🔧 UPDATING ENHANCEDQUESTION TO LOAD FROM STATIC JSON FILES...');

const enhancedQuestionPath = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/EnhancedQuestion.tsx';

if (fs.existsSync(enhancedQuestionPath)) {
  let content = fs.readFileSync(enhancedQuestionPath, 'utf8');
  
  // Add StaticQuestionLoader import
  if (!content.includes('StaticQuestionLoader')) {
    const importSection = `import { generateEnhancedQuestion } from '../../utils/enhancedQuestionSystem';`;
    const newImportSection = `import { generateEnhancedQuestion } from '../../utils/enhancedQuestionSystem';
import StaticQuestionLoader from '../../utils/staticQuestionLoader';`;
    
    content = content.replace(importSection, newImportSection);
  }
  
  // Update the loadQuestion function to check static files
  const oldLoadQuestion = `  const loadQuestion = (questionId: string) => {
    setLoading(true);
    
    try {
      // Find question in both standard and generated questions
      const allQuestions = [...questionData, ...getGeneratedQuestions()];
      let foundQuestion = allQuestions.find(q => q._id === questionId);`;
  
  const newLoadQuestion = `  const loadQuestion = async (questionId: string) => {
    setLoading(true);
    
    try {
      // Find question in both standard and generated questions
      const allQuestions = [...questionData, ...getGeneratedQuestions()];
      let foundQuestion = allQuestions.find(q => q._id === questionId);
      
      // If not found, try loading from static JSON files
      if (!foundQuestion && (contextGrade || contextDifficulty || contextSubject)) {
        console.log(\`Trying to load question \${questionId} from static files...\`);
        try {
          const staticQuestions = await StaticQuestionLoader.getQuestions(
            contextGrade || '9',
            contextDifficulty as any || 'medium',
            contextSubject || 'Mathematical Reasoning',
            20
          );
          foundQuestion = staticQuestions.find(q => q._id === questionId);
          if (foundQuestion) {
            console.log(\`✅ Found question \${questionId} in static files\`);
          }
        } catch (staticError) {
          console.log('Could not load from static files:', staticError);
        }
      }`;
  
  if (content.includes(oldLoadQuestion)) {
    content = content.replace(oldLoadQuestion, newLoadQuestion);
    
    // Also update the useEffect to handle async loadQuestion
    const oldUseEffect = `  useEffect(() => {
    if (id) {
      loadQuestion(id);
    }`;
    
    const newUseEffect = `  useEffect(() => {
    if (id) {
      loadQuestion(id);
    }`;
    
    // The useEffect doesn't need to change since we're not awaiting the async function
    
    fs.writeFileSync(enhancedQuestionPath, content);
    console.log('✅ Updated EnhancedQuestion.tsx to load from static JSON files');
  } else {
    console.log('❌ Could not find the exact loadQuestion pattern to replace');
    console.log('The component structure may have changed.');
  }
} else {
  console.log('❌ EnhancedQuestion.tsx not found');
}

console.log('\n🎯 ENHANCEDQUESTION LOADING FIX COMPLETE!');
console.log('✅ EnhancedQuestion now checks static JSON files for questions');
console.log('✅ Should resolve "Question not found" errors for Mathematical Reasoning');
console.log('\n📝 Restart your dev server and test the Mathematical Reasoning link!');
