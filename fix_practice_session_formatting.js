#!/usr/bin/env node

const fs = require('fs');

const PRACTICE_SESSION_FILE = './testace-app/frontend/src/pages/Practice/PracticeSession.tsx';

function fixPracticeSessionFormatting() {
  console.log('🎨 FIXING PRACTICE SESSION PASSAGE FORMATTING');
  console.log('=============================================\n');
  
  try {
    let content = fs.readFileSync(PRACTICE_SESSION_FILE, 'utf8');
    
    // Add FormattedText component after the imports section
    const importEnd = content.indexOf('interface PracticeSessionState');
    
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
    
    content = content.slice(0, importEnd) + formattedTextComponent + content.slice(importEnd);
    
    // Replace the question content display
    content = content.replace(
      '{currentQuestion.content}',
      '<FormattedText text={currentQuestion.content} />'
    );
    
    fs.writeFileSync(PRACTICE_SESSION_FILE, content);
    
    console.log('✅ Added FormattedText component to PracticeSession');
    console.log('✅ Replaced question content display');
    console.log('\\n🎯 PracticeSession formatting fix applied!');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

if (require.main === module) {
  fixPracticeSessionFormatting();
}
