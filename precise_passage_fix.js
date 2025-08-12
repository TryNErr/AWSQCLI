#!/usr/bin/env node

const fs = require('fs');

const QUESTION_FILE = './testace-app/frontend/src/pages/Practice/Question.tsx';

function precisePassageFix() {
  console.log('🎨 APPLYING PRECISE PASSAGE FORMATTING FIX');
  console.log('==========================================\n');
  
  try {
    let content = fs.readFileSync(QUESTION_FILE, 'utf8');
    
    // Add FormattedText component after the getDifficultyLevel function
    const getDifficultyEnd = content.indexOf('};', content.indexOf('const getDifficultyLevel')) + 2;
    
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
};`;
    
    content = content.slice(0, getDifficultyEnd) + formattedTextComponent + content.slice(getDifficultyEnd);
    
    // Replace the specific line with question.content
    content = content.replace(
      '            <Typography variant="h5" gutterBottom>\n              {question.content}\n            </Typography>',
      '            <FormattedText text={question.content} />'
    );
    
    fs.writeFileSync(QUESTION_FILE, content);
    
    console.log('✅ Added FormattedText component');
    console.log('✅ Replaced question content display');
    console.log('\\n🎯 Passage formatting fix applied successfully!');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

if (require.main === module) {
  precisePassageFix();
}
