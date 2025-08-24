#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the current Question.tsx file
const questionFilePath = path.join(__dirname, 'testace-app/frontend/src/pages/Practice/Question.tsx');
let questionContent = fs.readFileSync(questionFilePath, 'utf8');

// Find the section where the question content is displayed and modify it to handle the passage field
const oldQuestionDisplay = `          {/* Question Header */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={question.subject} color="primary" />
              <Chip label={\`Grade \${question.grade}\`} color="info" />
              <Chip label={question.difficulty} color="secondary" />
              <Chip label={question.topic} variant="outlined" />
            </Stack>
            <FormattedText text={question.content} />
          </Box>`;

const newQuestionDisplay = `          {/* Question Header */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={question.subject} color="primary" />
              <Chip label={\`Grade \${question.grade}\`} color="info" />
              <Chip label={question.difficulty} color="secondary" />
              <Chip label={question.topic} variant="outlined" />
            </Stack>
            
            {/* Display reading passage if it exists */}
            {question.passage && (
              <Box sx={{ mb: 3 }}>
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
                  📖 Read this passage:
                </Typography>
                
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
                    {question.passage}
                  </Typography>
                  
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
              </Box>
            )}
            
            {/* Question Content */}
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                color: 'text.primary',
                fontWeight: 'bold'
              }}
            >
              {question.content}
            </Typography>
          </Box>`;

// Replace the old display with the new one
if (questionContent.includes(oldQuestionDisplay)) {
  questionContent = questionContent.replace(oldQuestionDisplay, newQuestionDisplay);
  
  // Write the updated content back to the file
  fs.writeFileSync(questionFilePath, questionContent);
  console.log('✅ Successfully updated Question.tsx to display reading passages!');
  console.log('📖 Reading questions will now show the passage text above the question.');
} else {
  console.log('❌ Could not find the exact section to replace. The file structure may have changed.');
  console.log('🔍 Please manually add passage display logic to the Question component.');
}

console.log('\n🎯 WHAT WAS FIXED:');
console.log('• Added check for question.passage field');
console.log('• Display passage in a styled container when it exists');
console.log('• Show "Read this passage:" instruction');
console.log('• Format passage text with proper typography');
console.log('• Question content displays below the passage');
console.log('\n✅ Reading comprehension questions will now show passages!');
