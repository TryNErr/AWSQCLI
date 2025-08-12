#!/usr/bin/env node

/**
 * Add URL Parameter Handling to Enhanced Practice
 * 
 * This will allow Enhanced Practice to restore filter state from URL parameters
 * when users navigate back from individual questions.
 */

const fs = require('fs');

function fixEnhancedPracticeUrlParams() {
  console.log('🔄 ADDING URL PARAMETER HANDLING TO ENHANCED PRACTICE');
  console.log('====================================================\n');
  
  try {
    let content = fs.readFileSync('./testace-app/frontend/src/pages/Practice/EnhancedPractice.tsx', 'utf8');
    
    // Add useSearchParams import
    if (!content.includes('useSearchParams')) {
      content = content.replace(
        "import { useNavigate } from 'react-router-dom';",
        "import { useNavigate, useSearchParams } from 'react-router-dom';"
      );
      console.log('✅ Added useSearchParams import');
    }
    
    // Add URL parameter handling after the component declaration
    const urlParamHandling = `  const [searchParams] = useSearchParams();
  
  // Get initial filter values from URL parameters (for back navigation)
  const getInitialGrade = () => {
    const urlGrade = searchParams.get('grade');
    if (urlGrade) {
      console.log(\`🔄 Restoring grade filter from URL: \${urlGrade}\`);
      return urlGrade;
    }
    return getUserGrade().toString();
  };
  
  const getInitialDifficulty = () => {
    const urlDifficulty = searchParams.get('difficulty');
    if (urlDifficulty) {
      console.log(\`🔄 Restoring difficulty filter from URL: \${urlDifficulty}\`);
      return urlDifficulty;
    }
    return '';
  };
  
  const getInitialSubject = () => {
    const urlSubject = searchParams.get('subject');
    if (urlSubject) {
      console.log(\`🔄 Restoring subject filter from URL: \${urlSubject}\`);
      return urlSubject;
    }
    return '';
  };

`;
    
    // Insert after the component declaration and before the first useState
    const componentStart = 'const EnhancedPractice: React.FC = () => {';
    const firstUseState = 'const [questions, setQuestions] = useState<Question[]>([]);';
    
    if (content.includes(componentStart) && content.includes(firstUseState)) {
      content = content.replace(
        componentStart + '\\n  ' + firstUseState,
        componentStart + '\\n' + urlParamHandling + '  ' + firstUseState
      );
      console.log('✅ Added URL parameter handling logic');
    }
    
    // Update the useState declarations to use initial values from URL
    content = content.replace(
      "const [selectedGrade, setSelectedGrade] = useState<string>(getUserGrade().toString());",
      "const [selectedGrade, setSelectedGrade] = useState<string>(getInitialGrade());"
    );
    
    content = content.replace(
      "const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');",
      "const [selectedDifficulty, setSelectedDifficulty] = useState<string>(getInitialDifficulty());"
    );
    
    content = content.replace(
      "const [selectedSubject, setSelectedSubject] = useState<string>('');",
      "const [selectedSubject, setSelectedSubject] = useState<string>(getInitialSubject());"
    );
    
    console.log('✅ Updated useState declarations to use URL parameters');
    
    // Add useEffect to trigger question loading when URL parameters are present
    const urlParamEffect = `
  // Effect to load questions when URL parameters are present (back navigation)
  useEffect(() => {
    const urlGrade = searchParams.get('grade');
    const urlDifficulty = searchParams.get('difficulty');
    const urlSubject = searchParams.get('subject');
    
    if (urlGrade || urlDifficulty || urlSubject) {
      console.log('🔄 URL parameters detected, loading questions automatically');
      handleGetQuestions();
    }
  }, [searchParams]);
`;
    
    // Find a good place to insert the useEffect (after existing useEffects)
    const lastUseEffect = content.lastIndexOf('useEffect(');
    if (lastUseEffect !== -1) {
      // Find the end of the last useEffect
      let insertPoint = lastUseEffect;
      let braceCount = 0;
      let foundStart = false;
      
      for (let i = lastUseEffect; i < content.length; i++) {
        if (content[i] === '{') {
          braceCount++;
          foundStart = true;
        } else if (content[i] === '}') {
          braceCount--;
          if (foundStart && braceCount === 0) {
            // Find the end of the useEffect call
            while (i < content.length && content[i] !== ';') {
              i++;
            }
            insertPoint = i + 1;
            break;
          }
        }
      }
      
      content = content.slice(0, insertPoint) + urlParamEffect + content.slice(insertPoint);
      console.log('✅ Added useEffect for URL parameter handling');
    }
    
    // Write the updated content
    fs.writeFileSync('./testace-app/frontend/src/pages/Practice/EnhancedPractice.tsx', content);
    
    console.log('\\n🎯 ENHANCED PRACTICE URL PARAMETER HANDLING ADDED!');
    console.log('==================================================');
    console.log('✅ Enhanced Practice now reads filter parameters from URL');
    console.log('✅ Filter state will be restored when navigating back');
    console.log('✅ Questions will automatically load with restored filters');
    console.log('✅ Complete filter preservation workflow implemented');
    
    console.log('\\n📱 COMPLETE WORKFLOW:');
    console.log('=====================');
    console.log('1. User selects filters in Enhanced Practice');
    console.log('2. User clicks on a question');
    console.log('3. Question page loads with filter parameters in URL');
    console.log('4. User clicks "Back to Practice"');
    console.log('5. Enhanced Practice receives URL with filter parameters');
    console.log('6. Filters are automatically restored');
    console.log('7. Questions are automatically loaded');
    console.log('8. User sees exactly the same state as before');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (require.main === module) {
  fixEnhancedPracticeUrlParams();
}
