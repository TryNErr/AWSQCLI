#!/usr/bin/env node

/**
 * Simple Passage Formatting Fix
 * 
 * Add a FormattedText component and replace the question content display
 */

const fs = require('fs');

const QUESTION_FILE = './testace-app/frontend/src/pages/Practice/Question.tsx';

function simplePassageFix() {
  console.log('🎨 APPLYING SIMPLE PASSAGE FORMATTING FIX');
  console.log('=========================================\n');
  
  try {
    let content = fs.readFileSync(QUESTION_FILE, 'utf8');
    
    // First, add the FormattedText component after the imports
    const importSection = content.substring(0, content.indexOf('// Helper function to shuffle'));
    const restOfFile = content.substring(content.indexOf('// Helper function to shuffle'));
    
    const formattedTextComponent = `
// Component to properly format reading passages with paragraph breaks
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const paragraphs = text.split('\\n\\n').filter(p => p.trim().length > 0);
  
  return (
    <Box>
      {paragraphs.map((paragraph, index) => {
        const parts = paragraph.split('**');
        const formattedParagraph = parts.map((part, partIndex) => 
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
              whiteSpace: 'pre-line'
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
    
    content = importSection + formattedTextComponent + restOfFile;
    
    // Now find and replace the question content display
    // Look for the pattern where question.content is displayed
    const questionContentPattern = /<Typography variant="h5" gutterBottom>\\s*{question\\.content}\\s*<\\/Typography>/;
    
    if (questionContentPattern.test(content)) {
      content = content.replace(questionContentPattern, '<FormattedText text={question.content} />');
      console.log('✅ Replaced Typography with FormattedText component');
    } else {
      // Try a simpler pattern
      content = content.replace('{question.content}', '<FormattedText text={question.content} />');
      console.log('✅ Replaced question.content with FormattedText component');
    }
    
    // Write the fixed content
    fs.writeFileSync(QUESTION_FILE, content);
    
    console.log('\\n🎯 Simple Passage Fix Applied!');
    console.log('===============================');
    console.log('✅ Added FormattedText component');
    console.log('✅ Reading passages will now display with proper paragraphs');
    console.log('✅ Bold text (**text**) will be formatted correctly');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

if (require.main === module) {
  simplePassageFix();
}
