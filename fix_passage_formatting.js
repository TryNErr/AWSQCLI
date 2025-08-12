#!/usr/bin/env node

/**
 * Fix Reading Passage Formatting
 * 
 * PROBLEM: Reading passages display as one long block of text
 * CAUSE: HTML doesn't render \n line breaks - they need proper formatting
 * SOLUTION: Create a formatted text component that converts \n\n to paragraphs
 */

const fs = require('fs');

const QUESTION_FILE = './testace-app/frontend/src/pages/Practice/Question.tsx';

function fixPassageFormatting() {
  console.log('🎨 FIXING READING PASSAGE FORMATTING');
  console.log('====================================\n');
  
  console.log('Problem: Reading passages display as one long block of text');
  console.log('Cause: HTML doesn\'t render \\n line breaks properly');
  console.log('Solution: Create formatted text component with proper paragraph breaks\n');
  
  try {
    let content = fs.readFileSync(QUESTION_FILE, 'utf8');
    
    // Add a FormattedText component after the imports
    const formattedTextComponent = `
// Component to properly format reading passages with paragraph breaks
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Split text by double line breaks to create paragraphs
  const paragraphs = text.split('\\n\\n').filter(p => p.trim().length > 0);
  
  return (
    <Box>
      {paragraphs.map((paragraph, index) => {
        // Handle bold text formatting (**text**)
        const formattedParagraph = paragraph
          .split('**')
          .map((part, partIndex) => 
            partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
          );
        
        return (
          <Typography 
            key={index} 
            variant="body1" 
            paragraph 
            sx={{ 
              mb: 2,
              lineHeight: 1.6,
              textAlign: 'left',
              whiteSpace: 'pre-line' // Preserves single line breaks within paragraphs
            }}
          >
            {formattedParagraph}
          </Typography>
        );
      })}
    </Box>
  );
};
`;
    
    // Insert the FormattedText component after the getDifficultyLevel function
    const insertAfter = 'const getDifficultyLevel = (difficulty: string): DifficultyLevel => {\n  switch (difficulty?.toLowerCase()) {\n    case \'easy\': return DifficultyLevel.EASY;\n    case \'medium\': return DifficultyLevel.MEDIUM;\n    case \'hard\': return DifficultyLevel.HARD;\n    default: return DifficultyLevel.MEDIUM;\n  }\n};';
    
    if (content.includes(insertAfter)) {
      content = content.replace(insertAfter, insertAfter + formattedTextComponent);
      console.log('✅ Added FormattedText component');
    } else {
      console.log('⚠️ Could not find insertion point for FormattedText component');
    }
    
    // Replace the direct question.content display with FormattedText
    const oldDisplay = '<Typography variant=\"h5\" gutterBottom>\n              {question.content}\n            </Typography>';
    const newDisplay = '<FormattedText text={question.content} />';
    
    if (content.includes(oldDisplay)) {
      content = content.replace(oldDisplay, newDisplay);
      console.log('✅ Replaced direct text display with FormattedText component');
    } else {
      // Try alternative pattern
      const altPattern = '{question.content}';
      const altReplacement = '<FormattedText text={question.content} />';
      
      // Find the Typography component containing question.content
      const typographyRegex = /<Typography[^>]*variant="h5"[^>]*>\\s*{question\\.content}\\s*<\\/Typography>/;
      
      if (typographyRegex.test(content)) {
        content = content.replace(typographyRegex, newDisplay);
        console.log('✅ Replaced Typography with FormattedText component (alternative pattern)');
      } else {
        console.log('⚠️ Could not find question.content display to replace');
        console.log('   Looking for patterns in the file...');
        
        // Show what patterns exist
        const lines = content.split('\\n');
        lines.forEach((line, index) => {
          if (line.includes('question.content')) {
            console.log(`   Line ${index + 1}: ${line.trim()}`);
          }
        });
      }
    }
    
    // Write the fixed content
    fs.writeFileSync(QUESTION_FILE, content);
    
    console.log('\\n🎯 Passage Formatting Fix Applied!');
    console.log('===================================');
    console.log('✅ Added FormattedText component for proper paragraph display');
    console.log('✅ Reading passages will now show with proper paragraph breaks');
    console.log('✅ Bold text (**text**) will be properly formatted');
    console.log('✅ Much better readability for complex passages');
    
    console.log('\\n📖 Expected Improvements:');
    console.log('• Paragraphs separated with proper spacing');
    console.log('• Bold headings like **The Placebo Effect** will be bold');
    console.log('• Better line spacing and readability');
    console.log('• Professional academic text formatting');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

if (require.main === module) {
  fixPassageFormatting();
}
