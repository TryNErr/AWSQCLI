const fs = require('fs');
const path = require('path');

// Proper Grade 9 hard English questions
const grade9HardEnglishQuestions = [
  {
    _id: "grade9_hard_english_001_fixed",
    content: "What is the function of the infinitive in: 'To succeed requires dedication'?",
    type: "multiple_choice",
    options: ["Subject", "Object", "Adverb", "Predicate"],
    correct_answer: 0,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "'To succeed' functions as the subject of the sentence."
  },
  {
    _id: "grade9_hard_english_002_fixed",
    content: "Identify the literary device in: 'The classroom was a battlefield.'",
    type: "multiple_choice",
    options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "This is a metaphor, directly comparing the classroom to a battlefield without using 'like' or 'as'."
  },
  {
    _id: "grade9_hard_english_003_fixed",
    content: "What type of clause is 'Although it was raining' in: 'Although it was raining, we went outside'?",
    type: "multiple_choice",
    options: ["Independent clause", "Dependent clause", "Noun clause", "Relative clause"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "'Although it was raining' is a dependent clause because it cannot stand alone as a complete sentence."
  },
  {
    _id: "grade9_hard_english_004_fixed",
    content: "In the sentence 'The book that I read was fascinating,' what is the function of 'that I read'?",
    type: "multiple_choice",
    options: ["Subject", "Predicate", "Adjective clause", "Adverb clause"],
    correct_answer: 2,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "'That I read' is an adjective clause that modifies the noun 'book'."
  },
  {
    _id: "grade9_hard_english_005_fixed",
    content: "What is the mood of the verb in: 'If I were you, I would study harder'?",
    type: "multiple_choice",
    options: ["Indicative", "Imperative", "Subjunctive", "Conditional"],
    correct_answer: 2,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "The subjunctive mood is used for hypothetical or contrary-to-fact situations, indicated by 'were' instead of 'was'."
  },
  {
    _id: "grade9_hard_english_006_fixed",
    content: "Identify the rhetorical device in: 'We shall fight on the beaches, we shall fight on the landing grounds.'",
    type: "multiple_choice",
    options: ["Anaphora", "Epistrophe", "Chiasmus", "Antithesis"],
    correct_answer: 0,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "Anaphora is the repetition of words at the beginning of successive clauses, here 'we shall fight'."
  },
  {
    _id: "grade9_hard_english_007_fixed",
    content: "What is the primary purpose of a thesis statement in an essay?",
    type: "multiple_choice",
    options: ["To introduce the topic", "To provide evidence", "To state the main argument", "To conclude the essay"],
    correct_answer: 2,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "A thesis statement presents the main argument or central claim that the essay will support."
  },
  {
    _id: "grade9_hard_english_008_fixed",
    content: "In poetry, what is the effect of enjambment?",
    type: "multiple_choice",
    options: ["Creates rhyme", "Maintains flow across line breaks", "Establishes meter", "Provides closure"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "Enjambment allows sentences to continue beyond line breaks, maintaining the flow and rhythm of the poem."
  },
  {
    _id: "grade9_hard_english_009_fixed",
    content: "What type of irony is demonstrated in: 'A fire station burns down'?",
    type: "multiple_choice",
    options: ["Verbal irony", "Dramatic irony", "Situational irony", "Cosmic irony"],
    correct_answer: 2,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "Situational irony occurs when the outcome is the opposite of what would be expected."
  },
  {
    _id: "grade9_hard_english_010_fixed",
    content: "Identify the literary technique in: 'Peter Piper picked a peck of pickled peppers.'",
    type: "multiple_choice",
    options: ["Assonance", "Consonance", "Alliteration", "Onomatopoeia"],
    correct_answer: 2,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "Alliteration is the repetition of initial consonant sounds, here the 'p' sound."
  },
  {
    _id: "grade9_hard_english_011_fixed",
    content: "What is the difference between denotation and connotation?",
    type: "multiple_choice",
    options: ["Denotation is literal, connotation is implied", "Denotation is positive, connotation is negative", "Denotation is modern, connotation is archaic", "Denotation is simple, connotation is complex"],
    correct_answer: 0,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "Denotation is the literal dictionary meaning, while connotation refers to implied or suggested meanings."
  },
  {
    _id: "grade9_hard_english_012_fixed",
    content: "In the sentence 'Running quickly, she caught the bus,' what is the function of 'Running quickly'?",
    type: "multiple_choice",
    options: ["Gerund phrase", "Participial phrase", "Infinitive phrase", "Prepositional phrase"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "'Running quickly' is a participial phrase that modifies the subject 'she'."
  },
  {
    _id: "grade9_hard_english_013_fixed",
    content: "What is the primary characteristic of a sonnet?",
    type: "multiple_choice",
    options: ["12 lines with ABAB rhyme scheme", "14 lines with specific rhyme scheme", "16 lines with free verse", "18 lines with couplets"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "A sonnet is a 14-line poem with a specific rhyme scheme, traditionally either Shakespearean or Petrarchan."
  },
  {
    _id: "grade9_hard_english_014_fixed",
    content: "Identify the type of figurative language in: 'Time is money.'",
    type: "multiple_choice",
    options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "This is a metaphor that equates time with money to suggest that time has value."
  },
  {
    _id: "grade9_hard_english_015_fixed",
    content: "What is the function of a foil character in literature?",
    type: "multiple_choice",
    options: ["To provide comic relief", "To create conflict", "To highlight traits of the protagonist", "To advance the plot"],
    correct_answer: 2,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "A foil character contrasts with the protagonist to highlight specific traits or qualities."
  },
  {
    _id: "grade9_hard_english_016_fixed",
    content: "In grammar, what is a dangling modifier?",
    type: "multiple_choice",
    options: ["A modifier without a clear subject", "A modifier at the end of a sentence", "A modifier that's too long", "A modifier that repeats information"],
    correct_answer: 0,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "A dangling modifier is a word or phrase that modifies a word not clearly stated in the sentence."
  },
  {
    _id: "grade9_hard_english_017_fixed",
    content: "What literary movement emphasized emotion, nature, and individualism?",
    type: "multiple_choice",
    options: ["Realism", "Romanticism", "Modernism", "Naturalism"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "Romanticism emphasized emotion, imagination, nature, and individual experience over reason."
  },
  {
    _id: "grade9_hard_english_018_fixed",
    content: "What is the purpose of stream of consciousness in literature?",
    type: "multiple_choice",
    options: ["To confuse readers", "To show realistic thought patterns", "To create suspense", "To advance plot quickly"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "Stream of consciousness attempts to portray the natural flow of thoughts in a character's mind."
  },
  {
    _id: "grade9_hard_english_019_fixed",
    content: "Identify the literary device in: 'The silence was deafening.'",
    type: "multiple_choice",
    options: ["Paradox", "Oxymoron", "Irony", "Hyperbole"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "This is an oxymoron, combining contradictory terms ('silence' and 'deafening') for effect."
  },
  {
    _id: "grade9_hard_english_020_fixed",
    content: "What distinguishes free verse from blank verse?",
    type: "multiple_choice",
    options: ["Free verse has no rhyme, blank verse has rhyme", "Free verse has no meter, blank verse has meter", "Free verse is modern, blank verse is classical", "Free verse is shorter, blank verse is longer"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "Free verse has no regular meter or rhyme, while blank verse has regular meter but no rhyme."
  },
  {
    _id: "grade9_hard_english_021_fixed",
    content: "In literary analysis, what is the difference between mood and tone?",
    type: "multiple_choice",
    options: ["Mood is the author's attitude, tone is the reader's feeling", "Mood is the reader's feeling, tone is the author's attitude", "Mood is explicit, tone is implicit", "Mood is universal, tone is personal"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "Mood is the emotional atmosphere affecting the reader, while tone is the author's attitude."
  },
  {
    _id: "grade9_hard_english_022_fixed",
    content: "What is the function of a frame narrative?",
    type: "multiple_choice",
    options: ["To provide multiple perspectives", "To create a story within a story", "To establish credibility", "All of the above"],
    correct_answer: 3,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "A frame narrative serves multiple functions: creating stories within stories, providing perspectives, and establishing credibility."
  },
  {
    _id: "grade9_hard_english_023_fixed",
    content: "What is the primary characteristic of Gothic literature?",
    type: "multiple_choice",
    options: ["Romantic themes", "Dark, mysterious atmosphere", "Historical settings", "Heroic characters"],
    correct_answer: 1,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "Gothic literature is characterized by dark, mysterious, and often supernatural atmospheres."
  },
  {
    _id: "grade9_hard_english_024_fixed",
    content: "In the context of literature, what does 'allegory' mean?",
    type: "multiple_choice",
    options: ["A story with hidden meaning", "A type of poem", "A character's speech", "A plot twist"],
    correct_answer: 0,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "An allegory is a story with symbolic meaning that represents deeper truths or moral lessons."
  },
  {
    _id: "grade9_hard_english_025_fixed",
    content: "What is the effect of using first-person narration?",
    type: "multiple_choice",
    options: ["Creates distance from characters", "Provides omniscient perspective", "Creates intimacy and personal connection", "Allows multiple viewpoints"],
    correct_answer: 2,
    subject: "English",
    grade: 9,
    difficulty: "hard",
    explanation: "First-person narration creates intimacy by allowing readers to experience events through the narrator's perspective."
  }
];

function fixGrade9HardEnglish() {
  console.log('🚨 EMERGENCY FIX: Grade 9 Hard English Duplicates');
  console.log('================================================\n');

  const filePath = 'testace-app/frontend/public/questions/9_hard_english.json';
  
  console.log('✅ Replacing entire file with proper varied questions...');
  
  // Write the new questions array
  fs.writeFileSync(filePath, JSON.stringify(grade9HardEnglishQuestions, null, 2));
  
  console.log('✅ File completely replaced with 25 unique questions');
  
  // Verify the fix
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const uniqueContents = new Set(data.map(q => q.content));
  
  console.log(`\n🔍 VERIFICATION:`);
  console.log(`   Total questions: ${data.length}`);
  console.log(`   Unique questions: ${uniqueContents.size}`);
  console.log(`   Duplicates: ${data.length - uniqueContents.size}`);
  
  if (uniqueContents.size === data.length) {
    console.log('✅ SUCCESS: All questions are now unique!');
  } else {
    console.log('❌ FAILED: Still have duplicates!');
  }
  
  // Check for the specific problematic question
  const infinitiveCount = data.filter(q => q.content.includes('To succeed requires dedication')).length;
  console.log(`   Infinitive question count: ${infinitiveCount}`);
  
  if (infinitiveCount <= 1) {
    console.log('✅ SUCCESS: Infinitive question duplication fixed!');
  } else {
    console.log('❌ FAILED: Infinitive question still duplicated!');
  }
}

fixGrade9HardEnglish();
