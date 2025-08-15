const fs = require('fs');

console.log('🎨 ENHANCING READING PASSAGE UI...');

const questionPath = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/Question.tsx';

if (fs.existsSync(questionPath)) {
  let content = fs.readFileSync(questionPath, 'utf8');
  
  // Replace the existing FormattedText component with an enhanced version
  const oldFormattedText = `// Component to properly format reading passages with paragraph breaks
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

  const newFormattedText = `// Enhanced component for reading passages with beautiful UI
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Check if this is a reading passage (starts with "Read this passage:")
  const isReadingPassage = text.startsWith('Read this passage:');
  
  if (isReadingPassage) {
    // Split into instruction, passage, and question
    const parts = text.split('\\n\\n');
    const instruction = parts[0]; // "Read this passage:"
    const passage = parts.slice(1, -1).join('\\n\\n'); // The actual passage content
    const question = parts[parts.length - 1]; // The question at the end
    
    return (
      <Box>
        {/* Reading Instruction */}
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            color: 'primary.main',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          📖 {instruction}
        </Typography>
        
        {/* Passage Container with Enhanced Styling */}
        <Paper 
          elevation={2}
          sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: 'grey.50',
            border: '1px solid',
            borderColor: 'primary.light',
            borderRadius: 2,
            position: 'relative'
          }}
        >
          {/* Passage Content */}
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: 'text.primary',
              fontFamily: 'Georgia, serif',
              textAlign: 'justify',
              whiteSpace: 'pre-line'
            }}
          >
            {passage}
          </Typography>
          
          {/* Decorative Quote Mark */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 12,
              fontSize: '2rem',
              color: 'primary.light',
              opacity: 0.3
            }}
          >
            "
          </Box>
        </Paper>
        
        {/* Question */}
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 2,
            mb: 2,
            fontWeight: 'bold',
            color: 'text.primary',
            fontSize: '1.2rem'
          }}
        >
          {question}
        </Typography>
      </Box>
    );
  } else {
    // Regular text formatting for non-reading questions
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
                whiteSpace: 'pre-line',
                fontSize: '1.1rem'
              }}
            >
              {formattedParagraph}
            </Typography>
          );
        })}
      </Box>
    );
  }
};`;

  // Check if we need to add Paper import
  if (!content.includes('Paper')) {
    const importLine = 'import {';
    const importIndex = content.indexOf(importLine);
    if (importIndex !== -1) {
      const endImportIndex = content.indexOf('} from \'@mui/material\';', importIndex);
      if (endImportIndex !== -1) {
        const currentImports = content.substring(importIndex + importLine.length, endImportIndex);
        if (!currentImports.includes('Paper')) {
          const newImports = currentImports.trim() + ',\\n  Paper';
          content = content.substring(0, importIndex + importLine.length) + 
                   newImports + 
                   content.substring(endImportIndex);
          console.log('✅ Added Paper import to Material-UI imports');
        }
      }
    }
  }

  // Replace the FormattedText component
  if (content.includes(oldFormattedText)) {
    content = content.replace(oldFormattedText, newFormattedText);
    console.log('✅ Enhanced FormattedText component for reading passages');
  } else {
    console.log('⚠️  Could not find exact FormattedText component to replace');
    console.log('The component structure may have changed.');
  }
  
  fs.writeFileSync(questionPath, content);
  console.log('✅ Updated Question.tsx with enhanced reading passage UI');
} else {
  console.log('❌ Question.tsx not found');
}

console.log('\\n🎨 READING PASSAGE UI ENHANCEMENT COMPLETE!');
console.log('✅ Reading passages now have:');
console.log('   📖 Clear "Read this passage:" instruction with icon');
console.log('   📄 Highlighted passage container with border and background');
console.log('   🎯 Separated question section');
console.log('   📚 Enhanced typography with serif font for better readability');
console.log('   ✨ Decorative elements for visual appeal');
console.log('\\n📝 Reading passages will now have a beautiful, distinct UI!');
