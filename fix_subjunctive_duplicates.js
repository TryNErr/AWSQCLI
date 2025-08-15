const fs = require('fs');
const path = require('path');

const questionsDir = 'testace-app/frontend/public/questions';

// Advanced high school English questions to replace subjunctive duplicates
const replacementQuestions = [
    {
        _id: "grade_hard_english_subjunctive_replacement_001",
        content: "Identify the rhetorical strategy in: 'We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields.'",
        type: "multiple_choice",
        options: ["Anaphora", "Epistrophe", "Chiasmus", "Antithesis"],
        correct_answer: 0,
        explanation: "This is anaphora, the repetition of 'we shall fight' at the beginning of successive clauses for emphasis."
    },
    {
        _id: "grade_hard_english_subjunctive_replacement_002",
        content: "What is the primary function of a dramatic monologue in literature?",
        type: "multiple_choice",
        options: ["To advance the plot", "To reveal character psychology", "To provide exposition", "To create suspense"],
        correct_answer: 1,
        explanation: "A dramatic monologue primarily reveals the speaker's psychology, thoughts, and character through their speech."
    },
    {
        _id: "grade_hard_english_subjunctive_replacement_003",
        content: "In poetry, what is the effect of internal rhyme?",
        type: "multiple_choice",
        options: ["Creates visual patterns", "Enhances musical quality", "Establishes meter", "Provides structure"],
        correct_answer: 1,
        explanation: "Internal rhyme creates a musical quality within lines of poetry, enhancing the auditory experience."
    },
    {
        _id: "grade_hard_english_subjunctive_replacement_004",
        content: "Which literary technique is demonstrated in: 'The classroom was a zoo'?",
        type: "multiple_choice",
        options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
        correct_answer: 1,
        explanation: "This is a metaphor, directly comparing the classroom to a zoo without using 'like' or 'as'."
    },
    {
        _id: "grade_hard_english_subjunctive_replacement_005",
        content: "What is the purpose of stream of consciousness in literature?",
        type: "multiple_choice",
        options: ["To confuse readers", "To show realistic thought patterns", "To create suspense", "To advance plot quickly"],
        correct_answer: 1,
        explanation: "Stream of consciousness attempts to portray the natural flow of thoughts and feelings in a character's mind."
    },
    {
        _id: "grade_hard_english_subjunctive_replacement_006",
        content: "Identify the literary device in: 'The silence was deafening.'",
        type: "multiple_choice",
        options: ["Paradox", "Oxymoron", "Irony", "Hyperbole"],
        correct_answer: 1,
        explanation: "This is an oxymoron, combining contradictory terms ('silence' and 'deafening') for effect."
    },
    {
        _id: "grade_hard_english_subjunctive_replacement_007",
        content: "What distinguishes free verse from blank verse?",
        type: "multiple_choice",
        options: ["Free verse has no rhyme, blank verse has rhyme", "Free verse has no meter, blank verse has meter", "Free verse is modern, blank verse is classical", "Free verse is shorter, blank verse is longer"],
        correct_answer: 1,
        explanation: "Free verse has no regular meter or rhyme scheme, while blank verse has regular meter (usually iambic pentameter) but no rhyme."
    },
    {
        _id: "grade_hard_english_subjunctive_replacement_008",
        content: "In literary analysis, what is the difference between mood and tone?",
        type: "multiple_choice",
        options: ["Mood is the author's attitude, tone is the reader's feeling", "Mood is the reader's feeling, tone is the author's attitude", "Mood is explicit, tone is implicit", "Mood is universal, tone is personal"],
        correct_answer: 1,
        explanation: "Mood is the emotional atmosphere that affects the reader, while tone is the author's attitude toward the subject."
    },
    {
        _id: "grade_hard_english_subjunctive_replacement_009",
        content: "What is the function of a frame narrative?",
        type: "multiple_choice",
        options: ["To provide multiple perspectives", "To create a story within a story", "To establish credibility", "All of the above"],
        correct_answer: 3,
        explanation: "A frame narrative serves multiple functions: creating stories within stories, providing different perspectives, and establishing narrative credibility."
    },
    {
        _id: "grade_hard_english_subjunctive_replacement_010",
        content: "Identify the type of figurative language in: 'Time is money.'",
        type: "multiple_choice",
        options: ["Simile", "Metaphor", "Personification", "Synecdoche"],
        correct_answer: 1,
        explanation: "This is a metaphor, equating time with money to suggest that time has value and should not be wasted."
    },
    {
        _id: "grade_hard_english_subjunctive_replacement_011",
        content: "What is the primary characteristic of Gothic literature?",
        type: "multiple_choice",
        options: ["Romantic themes", "Dark, mysterious atmosphere", "Historical settings", "Heroic characters"],
        correct_answer: 1,
        explanation: "Gothic literature is characterized by dark, mysterious, and often supernatural atmospheres designed to evoke fear or suspense."
    }
];

function fixSubjunctiveDuplicates() {
    console.log('🔧 FIXING SUBJUNCTIVE MOOD QUESTION DUPLICATES');
    console.log('===============================================\n');

    const files = fs.readdirSync(questionsDir).filter(file => file.endsWith('.json'));
    let totalReplacements = 0;
    let filesModified = 0;

    // Find all instances of the subjunctive question
    const subjunctiveQuestion = "Which sentence uses the subjunctive mood correctly?";
    const filesWithSubjunctive = [];

    files.forEach(filename => {
        const filePath = path.join(questionsDir, filename);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Handle both array format and object format
        let questions = Array.isArray(data) ? data : (data.questions || []);
        
        const subjunctiveCount = questions.filter(q => q.content && q.content.includes(subjunctiveQuestion)).length;
        if (subjunctiveCount > 0) {
            filesWithSubjunctive.push({ filename, count: subjunctiveCount });
        }
    });

    console.log(`📊 Found subjunctive question in ${filesWithSubjunctive.length} files:`);
    filesWithSubjunctive.forEach(file => {
        console.log(`   ${file.filename}: ${file.count} instances`);
    });

    // Keep one instance in the first file, replace all others
    let keepFile = filesWithSubjunctive[0]?.filename;
    let replacementIndex = 0;

    filesWithSubjunctive.forEach(({ filename, count }) => {
        const filePath = path.join(questionsDir, filename);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let modified = false;

        // Handle both array format and object format
        let questions = Array.isArray(data) ? data : (data.questions || []);

        // If this is the keep file, keep only one instance
        if (filename === keepFile) {
            let foundFirst = false;
            questions = questions.map(question => {
                if (question.content && question.content.includes(subjunctiveQuestion)) {
                    if (!foundFirst) {
                        foundFirst = true;
                        return question; // Keep the first one
                    } else {
                        // Replace additional instances
                        const replacement = replacementQuestions[replacementIndex % replacementQuestions.length];
                        replacementIndex++;
                        totalReplacements++;
                        modified = true;
                        return replacement;
                    }
                }
                return question;
            });
        } else {
            // Replace all instances in other files
            questions = questions.map(question => {
                if (question.content && question.content.includes(subjunctiveQuestion)) {
                    const replacement = replacementQuestions[replacementIndex % replacementQuestions.length];
                    replacementIndex++;
                    totalReplacements++;
                    modified = true;
                    return replacement;
                }
                return question;
            });
        }

        if (modified) {
            // Write back in the same format
            if (Array.isArray(data)) {
                fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
            } else {
                data.questions = questions;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            }
            filesModified++;
            console.log(`✅ Fixed ${filename}`);
        }
    });

    console.log(`\n🎯 SUBJUNCTIVE FIX COMPLETE!`);
    console.log(`============================`);
    console.log(`✅ Files modified: ${filesModified}`);
    console.log(`✅ Questions replaced: ${totalReplacements}`);
    console.log(`✅ Kept one instance in: ${keepFile}`);

    // Verify the fix
    console.log('\n🔍 VERIFYING FIX...');
    let remainingDuplicates = 0;
    files.forEach(filename => {
        const filePath = path.join(questionsDir, filename);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Handle both array format and object format
        let questions = Array.isArray(data) ? data : (data.questions || []);
        
        const count = questions.filter(q => q.content && q.content.includes(subjunctiveQuestion)).length;
        if (count > 0) {
            remainingDuplicates += count;
            if (count > 1 || filename !== keepFile) {
                console.log(`⚠️  ${filename}: ${count} instances remaining`);
            }
        }
    });

    if (remainingDuplicates <= 1) {
        console.log('✅ All subjunctive duplicates successfully eliminated!');
    } else {
        console.log(`⚠️  ${remainingDuplicates} instances still remain`);
    }
}

fixSubjunctiveDuplicates();
