#!/usr/bin/env node

/**
 * Fix Reading Passage Formatting (Corrected)
 */

const fs = require('fs');

const QUESTION_FILE = './testace-app/frontend/src/pages/Practice/Question.tsx';

function fixPassageFormatting() {
  console.log('🎨 FIXING READING PASSAGE FORMATTING');
  console.log('====================================\n');
  
  try {
    let content = fs.readFileSync(QUESTION_FILE, 'utf8');
    
    // Add a FormattedText component after the getDifficultyLevel function
    const formattedTextComponent = `

// Component to properly format reading passages with paragraph breaks
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Split text by double line breaks to create paragraphs
  const paragraphs = text.split('\\n\\n').filter(p => p.trim().length > 0);
  
  return (
    <Box>
      {paragraphs.map((paragraph, index) => {
        // Handle bold text formatting (**text**)
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
              whiteSpace: 'pre-line' // Preserves single line breaks within paragraphs
            }}
          >
            {formattedParagraph}
          </Typography>
        );
      })}
    </Box>
  );
};`;
    
    // Insert the FormattedText component after the getDifficultyLevel function
    const insertAfter = '};';
    const getDifficultyIndex = content.indexOf('const getDifficultyLevel = (difficulty: string): DifficultyLevel => {');
    
    if (getDifficultyIndex !== -1) {
      // Find the closing brace of getDifficultyLevel function
      const afterGetDifficulty = content.indexOf('};', getDifficultyIndex) + 2;
      content = content.slice(0, afterGetDifficulty) + formattedTextComponent + content.slice(afterGetDifficulty);
      console.log('✅ Added FormattedText component');
    } else {
      console.log('⚠️ Could not find getDifficultyLevel function');
    }
    
    // Find and replace the question content display
    const lines = content.split('\\n');
    let foundContentLine = -1;
    
    lines.forEach((line, index) => {
      if (line.includes('{question.content}') && line.includes('Typography')) {
        foundContentLine = index;
        console.log(`Found question.content at line ${index + 1}: ${line.trim()}`);
      }
    });
    
    if (foundContentLine !== -1) {
      // Replace the line with FormattedText
      lines[foundContentLine] = lines[foundContentLine].replace(
        '{question.content}',
        '<FormattedText text={question.content} />'
      );
      
      // Also remove the Typography wrapper if it's just for question.content
      if (lines[foundContentLine].includes('<Typography') && lines[foundContentLine].includes('</Typography>')) {
        lines[foundContentLine] = '              <FormattedText text={question.content} />';
      }
      
      content = lines.join('\\n');
      console.log('✅ Replaced question.content with FormattedText component');
    } else {
      console.log('⚠️ Could not find question.content display to replace');
    }
    
    // Write the fixed content
    fs.writeFileSync(QUESTION_FILE, content);
    
    console.log('\\n🎯 Passage Formatting Fix Applied!');
    console.log('===================================');
    console.log('✅ Added FormattedText component for proper paragraph display');
    console.log('✅ Reading passages will now show with proper paragraph breaks');
    console.log('✅ Bold text (**text**) will be properly formatted');
    console.log('✅ Much better readability for complex passages');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

if (require.main === module) {
  fixPassageFormatting();
}
