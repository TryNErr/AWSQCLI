
/**
 * STRICT SUBJECT FILTERING PATCH
 * 
 * This patch ensures that when users filter for a specific subject,
 * they ONLY get questions from that subject - no mixing or fallbacks.
 */

// Add this function to your question loading logic
function strictSubjectFilter(questions, requestedSubject) {
  console.log(`🔍 Strict filtering: Requested "${requestedSubject}", filtering ${questions.length} questions`);
  
  // Normalize the requested subject
  const normalizedRequested = normalizeSubjectForFiltering(requestedSubject);
  
  // Filter questions with exact subject match
  const filtered = questions.filter(question => {
    const questionSubject = normalizeSubjectForFiltering(question.subject);
    const matches = questionSubject === normalizedRequested;
    
    if (!matches) {
      console.log(`❌ Filtered out: "${question.content.substring(0, 50)}..." (Subject: ${question.subject})`);
    }
    
    return matches;
  });
  
  console.log(`✅ Strict filter result: ${filtered.length} questions match "${requestedSubject}"`);
  
  // Log any remaining questions for verification
  if (filtered.length > 0) {
    console.log(`📝 Sample filtered questions:`);
    filtered.slice(0, 3).forEach((q, i) => {
      console.log(`   ${i + 1}. "${q.content.substring(0, 40)}..." (Subject: ${q.subject})`);
    });
  }
  
  return filtered;
}

function normalizeSubjectForFiltering(subject) {
  if (!subject) return '';
  
  const normalized = subject.toLowerCase().trim();
  
  // Exact mappings for filtering
  if (normalized === 'english' || normalized === 'english language arts') return 'english';
  if (normalized === 'mathematics' || normalized === 'math') return 'mathematics';
  if (normalized === 'reading' || normalized === 'reading comprehension') return 'reading';
  if (normalized === 'thinking skills' || normalized === 'critical thinking') return 'thinking-skills';
  
  return normalized;
}

// Use this instead of loose filtering
export { strictSubjectFilter, normalizeSubjectForFiltering };
