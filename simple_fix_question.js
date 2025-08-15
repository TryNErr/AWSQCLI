const fs = require('fs');

console.log('🔧 SIMPLE FIX FOR QUESTION COMPONENT STRUCTURE...');

const questionPath = '/workspaces/AWSQCLI/testace-app/frontend/src/pages/Practice/Question.tsx';

if (fs.existsSync(questionPath)) {
  let content = fs.readFileSync(questionPath, 'utf8');
  
  // The issue is that there's an orphaned setLoading(false); at line 444
  // I need to wrap it in proper try-catch-finally structure
  
  // Find and replace the orphaned setLoading(false);
  const problematicSection = `    );

    setLoading(false);
  };`;
  
  const fixedSection = `    );
    } catch (error) {
      console.error('Error loading question:', error);
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };`;
  
  if (content.includes(problematicSection)) {
    content = content.replace(problematicSection, fixedSection);
    fs.writeFileSync(questionPath, content);
    console.log('✅ Fixed Question component structure');
  } else {
    console.log('❌ Could not find the exact problematic section');
    console.log('Let me try a different approach...');
    
    // Alternative approach: find the orphaned setLoading and fix it
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === 'setLoading(false);' && i > 400) {
        // Check if this line is outside a function (no proper indentation context)
        if (lines[i-1] && lines[i-1].trim() === ');' && lines[i-2] && lines[i-2].includes('explanation')) {
          // This is the orphaned setLoading - fix it
          lines[i-1] = lines[i-1] + '\n    } catch (error) {\n      console.error(\'Error loading question:\', error);\n      setQuestion(null);\n    } finally {';
          lines[i] = '      setLoading(false);\n    }';
          
          const fixedContent = lines.join('\n');
          fs.writeFileSync(questionPath, fixedContent);
          console.log('✅ Fixed orphaned setLoading with alternative approach');
          break;
        }
      }
    }
  }
} else {
  console.log('❌ Question.tsx not found');
}

console.log('\n🎯 SIMPLE FIX COMPLETE!');
console.log('✅ Question component structure should now be valid');
console.log('📝 TypeScript compilation errors should be resolved!');
