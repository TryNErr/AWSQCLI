const fs = require('fs');
const path = require('path');

const questionsDir = 'testace-app/frontend/public/questions';

// Advanced high school English questions to replace gerund duplicates
const replacementQuestions = [
    {
        _id: "grade_hard_english_replacement_001",
        content: "Identify the rhetorical device in: 'Ask not what your country can do for you—ask what you can do for your country.'",
        type: "multiple_choice",
        options: ["Chiasmus", "Anaphora", "Epistrophe", "Polysyndeton"],
        correct_answer: 0,
        explanation: "This is chiasmus, a rhetorical device where the order of words in the first clause is reversed in the second clause."
    },
    {
        _id: "grade_hard_english_replacement_002",
        content: "In literary analysis, what is the difference between 'theme' and 'motif'?",
        type: "multiple_choice",
        options: ["Theme is universal, motif is specific to one work", "Theme is the main idea, motif is a recurring element", "Theme is explicit, motif is implicit", "Theme is plot-based, motif is character-based"],
        correct_answer: 1,
        explanation: "A theme is the central message or main idea of a work, while a motif is a recurring element (image, symbol, phrase) that supports the theme."
    },
    {
        _id: "grade_hard_english_replacement_003",
        content: "Which sentence demonstrates correct use of the subjunctive mood?",
        type: "multiple_choice",
        options: ["If I was rich, I would travel", "I wish I was taller", "If he were here, he would help", "I hope she was coming"],
        correct_answer: 2,
        explanation: "The subjunctive mood uses 'were' instead of 'was' in hypothetical or contrary-to-fact situations."
    },
    {
        _id: "grade_hard_english_replacement_004",
        content: "Identify the literary technique in: 'The pen is mightier than the sword.'",
        type: "multiple_choice",
        options: ["Synecdoche", "Metonymy", "Metaphor", "Personification"],
        correct_answer: 1,
        explanation: "This is metonymy, where 'pen' represents writing/words and 'sword' represents violence/force."
    },
    {
        _id: "grade_hard_english_replacement_005",
        content: "What is the function of a caesura in poetry?",
        type: "multiple_choice",
        options: ["To create rhyme", "To establish meter", "To create a pause within a line", "To end a stanza"],
        correct_answer: 2,
        explanation: "A caesura is a deliberate pause or break within a line of poetry, often marked by punctuation."
    },
    {
        _id: "grade_hard_english_replacement_006",
        content: "In Shakespeare's sonnets, what is the typical rhyme scheme of the final couplet?",
        type: "multiple_choice",
        options: ["AA", "BB", "CC", "DD"],
        correct_answer: 2,
        explanation: "Shakespearean sonnets typically end with a rhyming couplet (CC), which often provides a conclusion or twist."
    },
    {
        _id: "grade_hard_english_replacement_007",
        content: "Which term describes the use of informal language in literature to reflect how people actually speak?",
        type: "multiple_choice",
        options: ["Vernacular", "Colloquialism", "Dialect", "All of the above"],
        correct_answer: 3,
        explanation: "Vernacular, colloquialism, and dialect all refer to informal, everyday language used to create realistic dialogue."
    },
    {
        _id: "grade_hard_english_replacement_008",
        content: "What is the primary purpose of a foil character in literature?",
        type: "multiple_choice",
        options: ["To provide comic relief", "To create conflict", "To highlight traits of the protagonist", "To advance the plot"],
        correct_answer: 2,
        explanation: "A foil character contrasts with the protagonist to highlight specific traits or qualities of the main character."
    },
    {
        _id: "grade_hard_english_replacement_009",
        content: "Identify the type of irony in: 'A fire station burns down while the firefighters are out on a call.'",
        type: "multiple_choice",
        options: ["Verbal irony", "Dramatic irony", "Situational irony", "Cosmic irony"],
        correct_answer: 2,
        explanation: "This is situational irony, where the outcome is the opposite of what would be expected."
    },
    {
        _id: "grade_hard_english_replacement_010",
        content: "In literary criticism, what does 'unreliable narrator' mean?",
        type: "multiple_choice",
        options: ["A narrator who lies deliberately", "A narrator whose credibility is compromised", "A narrator who changes perspective", "A narrator who knows everything"],
        correct_answer: 1,
        explanation: "An unreliable narrator is one whose credibility is compromised due to bias, limited knowledge, or psychological issues."
    },
    {
        _id: "grade_hard_english_replacement_011",
        content: "What is the difference between 'denotation' and 'connotation'?",
        type: "multiple_choice",
        options: ["Denotation is literal, connotation is implied", "Denotation is positive, connotation is negative", "Denotation is modern, connotation is archaic", "Denotation is simple, connotation is complex"],
        correct_answer: 0,
        explanation: "Denotation is the literal, dictionary meaning of a word, while connotation refers to the implied or suggested meanings."
    },
    {
        _id: "grade_hard_english_replacement_012",
        content: "Which literary movement emphasized emotion, nature, and individualism?",
        type: "multiple_choice",
        options: ["Realism", "Romanticism", "Modernism", "Naturalism"],
        correct_answer: 1,
        explanation: "Romanticism emphasized emotion, imagination, nature, and individual experience over reason and social conventions."
    },
    {
        _id: "grade_hard_english_replacement_013",
        content: "What is the purpose of enjambment in poetry?",
        type: "multiple_choice",
        options: ["To create rhyme", "To maintain rhythm across line breaks", "To emphasize certain words", "To create stanzas"],
        correct_answer: 1,
        explanation: "Enjambment allows a sentence or phrase to continue beyond the end of a line, maintaining flow and rhythm."
    },
    {
        _id: "grade_hard_english_replacement_014",
        content: "In grammar, what is a 'dangling modifier'?",
        type: "multiple_choice",
        options: ["A modifier without a clear subject", "A modifier at the end of a sentence", "A modifier that's too long", "A modifier that repeats information"],
        correct_answer: 0,
        explanation: "A dangling modifier is a word or phrase that modifies a word not clearly stated in the sentence, creating ambiguity."
    }
];

function fixGerundDuplicates() {
    console.log('🔧 FIXING GERUND QUESTION DUPLICATES');
    console.log('=====================================\n');

    const files = fs.readdirSync(questionsDir).filter(file => file.endsWith('.json'));
    let totalReplacements = 0;
    let filesModified = 0;

    // First, find all instances of the gerund question
    const gerundQuestion = "Swimming is my favorite activity";
    const filesWithGerund = [];

    files.forEach(filename => {
        const filePath = path.join(questionsDir, filename);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Handle both array format and object format
        let questions = Array.isArray(data) ? data : (data.questions || []);
        
        const gerundCount = questions.filter(q => q.content && q.content.includes(gerundQuestion)).length;
        if (gerundCount > 0) {
            filesWithGerund.push({ filename, count: gerundCount });
        }
    });

    console.log(`📊 Found gerund question in ${filesWithGerund.length} files:`);
    filesWithGerund.forEach(file => {
        console.log(`   ${file.filename}: ${file.count} instances`);
    });

    // Keep one instance in the first file, replace all others
    let keepFile = filesWithGerund[0]?.filename;
    let replacementIndex = 0;

    filesWithGerund.forEach(({ filename, count }) => {
        const filePath = path.join(questionsDir, filename);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let modified = false;

        // Handle both array format and object format
        let questions = Array.isArray(data) ? data : (data.questions || []);

        // If this is the keep file, keep only one instance
        if (filename === keepFile) {
            let foundFirst = false;
            questions = questions.map(question => {
                if (question.content && question.content.includes(gerundQuestion)) {
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
                if (question.content && question.content.includes(gerundQuestion)) {
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

    console.log(`\n🎯 GERUND FIX COMPLETE!`);
    console.log(`=======================`);
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
        
        const count = questions.filter(q => q.content && q.content.includes(gerundQuestion)).length;
        if (count > 0) {
            remainingDuplicates += count;
            if (count > 1 || filename !== keepFile) {
                console.log(`⚠️  ${filename}: ${count} instances remaining`);
            }
        }
    });

    if (remainingDuplicates <= 1) {
        console.log('✅ All gerund duplicates successfully eliminated!');
    } else {
        console.log(`⚠️  ${remainingDuplicates} instances still remain`);
    }
}

fixGerundDuplicates();
