const fs = require('fs');

console.log('📚 EXPANDING GRADE 12 HARD SUBJECTS TO 20 QUESTIONS...');

// Grade 12 Hard Math - Advanced Calculus and Analysis
const grade12HardMath = [
  {
    "_id": `calc_${Date.now()}_001`,
    "content": "Find the limit: lim(x→0) [sin(3x) - 3x + (9x³/2)] / x⁵",
    "type": "multiple_choice",
    "options": ["9/40", "-9/40", "27/40", "Does not exist"],
    "correctAnswer": "9/40",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Using Taylor series expansion and L'Hôpital's rule repeatedly"
  },
  {
    "_id": `calc_${Date.now()}_002`,
    "content": "Evaluate ∫₀^π x²sin(x)dx using integration by parts",
    "type": "multiple_choice",
    "options": ["π² - 4", "π² + 4", "2π² - 4", "π² - 2"],
    "correctAnswer": "π² - 4",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Apply integration by parts twice: u = x², dv = sin(x)dx"
  },
  {
    "_id": `calc_${Date.now()}_003`,
    "content": "Find dy/dx if x³ + y³ = 3axy (folium of Descartes)",
    "type": "multiple_choice",
    "options": ["(ay - x²)/(y² - ax)", "(ax - y²)/(x² - ay)", "(ay + x²)/(y² + ax)", "(x² - ay)/(ay - y²)"],
    "correctAnswer": "(ay - x²)/(y² - ax)",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Use implicit differentiation on the folium equation"
  },
  {
    "_id": `calc_${Date.now()}_004`,
    "content": "Determine convergence of Σ(n=1 to ∞) [n²/(3ⁿ + n³)]",
    "type": "multiple_choice",
    "options": ["Converges by ratio test", "Diverges by comparison", "Converges by root test", "Conditionally convergent"],
    "correctAnswer": "Converges by ratio test",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Ratio test gives limit = 1/3 < 1, so series converges"
  },
  {
    "_id": `calc_${Date.now()}_005`,
    "content": "Find the area between y = x³ - 6x² + 9x and y = x from x = 0 to x = 4",
    "type": "multiple_choice",
    "options": ["32/3", "16/3", "8", "20/3"],
    "correctAnswer": "32/3",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Set up integral of |f(x) - g(x)| accounting for intersection points"
  },
  {
    "_id": `calc_${Date.now()}_006`,
    "content": "Find the Taylor series for f(x) = ln(1 + x²) centered at x = 0",
    "type": "multiple_choice",
    "options": ["Σ(-1)ⁿ⁺¹x^(2n)/n", "Σ(-1)ⁿx^(2n+2)/(n+1)", "Σ(-1)ⁿx^(2n)/2n", "Σ(-1)ⁿ⁺¹x^(2n+2)/(2n+2)"],
    "correctAnswer": "Σ(-1)ⁿ⁺¹x^(2n+2)/(2n+2)",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Integrate the series for 2x/(1+x²) term by term"
  },
  {
    "_id": `calc_${Date.now()}_007`,
    "content": "Solve the differential equation: dy/dx + y tan(x) = sec(x)",
    "type": "multiple_choice",
    "options": ["y = x + C cos(x)", "y = (x + C)/cos(x)", "y = x cos(x) + C", "y = (sin(x) + C)/cos(x)"],
    "correctAnswer": "y = (x + C)/cos(x)",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "This is a first-order linear ODE with integrating factor μ(x) = sec(x)"
  },
  {
    "_id": `calc_${Date.now()}_008`,
    "content": "Find the volume of the solid formed by rotating y = e^(-x²) about the x-axis from x = 0 to x = ∞",
    "type": "multiple_choice",
    "options": ["π√π/2", "√π/2", "π/2", "π√(π/2)"],
    "correctAnswer": "π√π/2",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Use disk method: V = π∫₀^∞ e^(-2x²)dx, requires Gaussian integral"
  },
  {
    "_id": `calc_${Date.now()}_009`,
    "content": "Find the radius of curvature of y = x³ at the point (1, 1)",
    "type": "multiple_choice",
    "options": ["10√10/27", "27/(10√10)", "√10/3", "3√10"],
    "correctAnswer": "10√10/27",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Use κ = |y''|/(1 + (y')²)^(3/2), then R = 1/κ"
  },
  {
    "_id": `calc_${Date.now()}_010`,
    "content": "Evaluate ∫₀^(π/2) ln(sin x) dx",
    "type": "multiple_choice",
    "options": ["-π ln(2)/2", "π ln(2)/2", "-π ln(2)", "π ln(2)"],
    "correctAnswer": "-π ln(2)/2",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Use symmetry property and Feynman's trick with parameter differentiation"
  },
  {
    "_id": `calc_${Date.now()}_011`,
    "content": "Find the critical points of f(x,y) = x³ + y³ - 3xy",
    "type": "multiple_choice",
    "options": ["(0,0) and (1,1)", "(0,0) and (-1,-1)", "(1,1) and (-1,-1)", "(0,0), (1,1), and (-1,-1)"],
    "correctAnswer": "(0,0) and (1,1)",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Set ∂f/∂x = 3x² - 3y = 0 and ∂f/∂y = 3y² - 3x = 0"
  },
  {
    "_id": `calc_${Date.now()}_012`,
    "content": "Find the Maclaurin series for f(x) = x/(1-x-x²)",
    "type": "multiple_choice",
    "options": ["Σ F_n x^n", "Σ F_(n+1) x^n", "Σ F_(n-1) x^n", "Σ n F_n x^n"],
    "correctAnswer": "Σ F_(n+1) x^n",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "The coefficients are Fibonacci numbers F_n, starting with F_2 = 1"
  },
  {
    "_id": `calc_${Date.now()}_013`,
    "content": "Solve: ∫ x²/(x⁴ + 1) dx",
    "type": "multiple_choice",
    "options": ["(1/2√2)arctan((x²-1)/(x√2)) + C", "(1/2√2)ln|(x²-x√2+1)/(x²+x√2+1)| + C", "Both A and B", "Neither A nor B"],
    "correctAnswer": "Both A and B",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Factor x⁴+1 and use partial fractions with complex roots"
  },
  {
    "_id": `calc_${Date.now()}_014`,
    "content": "Find the length of the curve y = ln(sec x) from x = 0 to x = π/4",
    "type": "multiple_choice",
    "options": ["ln(√2 + 1)", "ln(1 + √2)", "ln(2 + √2)", "ln(√2)"],
    "correctAnswer": "ln(1 + √2)",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Use arc length formula with dy/dx = tan x, integrate √(1 + tan²x) = sec x"
  },
  {
    "_id": `calc_${Date.now()}_015`,
    "content": "Find the Fourier series coefficient a₁ for f(x) = |x| on [-π, π]",
    "type": "multiple_choice",
    "options": ["0", "2/π", "4/π", "-4/π"],
    "correctAnswer": "0",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "f(x) = |x| is even, so all sine coefficients are zero"
  },
  {
    "_id": `calc_${Date.now()}_016`,
    "content": "Evaluate lim(n→∞) (1 + 2 + 3 + ... + n)/n²",
    "type": "multiple_choice",
    "options": ["1/2", "1", "∞", "0"],
    "correctAnswer": "1/2",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Sum = n(n+1)/2, so limit is lim(n→∞) (n+1)/(2n) = 1/2"
  },
  {
    "_id": `calc_${Date.now()}_017`,
    "content": "Find the minimum value of f(x,y) = x² + y² subject to x + y = 1",
    "type": "multiple_choice",
    "options": ["1/4", "1/2", "1", "2"],
    "correctAnswer": "1/2",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Use Lagrange multipliers or substitute y = 1-x into f(x,y)"
  },
  {
    "_id": `calc_${Date.now()}_018`,
    "content": "Determine if ∫₁^∞ (ln x)/x² dx converges or diverges",
    "type": "multiple_choice",
    "options": ["Converges to 1", "Converges to -1", "Diverges", "Converges to 0"],
    "correctAnswer": "Converges to 1",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Use integration by parts: u = ln x, dv = x⁻² dx"
  },
  {
    "_id": `calc_${Date.now()}_019`,
    "content": "Find the equation of the tangent plane to z = x²y + xy² at (1, 2, 6)",
    "type": "multiple_choice",
    "options": ["6x + 3y - z = 6", "6x + 3y - z = 0", "3x + 6y - z = 9", "6x + 3y + z = 18"],
    "correctAnswer": "6x + 3y - z = 6",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Find ∂z/∂x and ∂z/∂y at (1,2), then use point-normal form"
  },
  {
    "_id": `calc_${Date.now()}_020`,
    "content": "Solve the separable differential equation: dy/dx = y²/(1 + x²)",
    "type": "multiple_choice",
    "options": ["y = 1/(C - arctan x)", "y = 1/(arctan x + C)", "y = C/(1 + x²)", "y = (1 + x²)/C"],
    "correctAnswer": "y = 1/(C - arctan x)",
    "subject": "Mathematics",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Separate variables: dy/y² = dx/(1+x²), integrate both sides"
  }
];

// Grade 12 Hard English - Advanced Literary Analysis
const grade12HardEnglish = [
  {
    "_id": `lit12_${Date.now()}_001`,
    "content": "In T.S. Eliot's 'The Waste Land', the phrase 'I will show you fear in a handful of dust' primarily employs which literary technique?",
    "type": "multiple_choice",
    "options": ["Synecdoche", "Metonymy", "Paradox", "Chiasmus"],
    "correctAnswer": "Paradox",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "The juxtaposition of 'fear' with 'handful of dust' creates a paradoxical image"
  },
  {
    "_id": `lit12_${Date.now()}_002`,
    "content": "Which narrative technique does Virginia Woolf employ in 'Mrs. Dalloway' to explore consciousness?",
    "type": "multiple_choice",
    "options": ["Stream of consciousness", "Epistolary format", "Multiple narrators", "Frame narrative"],
    "correctAnswer": "Stream of consciousness",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Woolf pioneered stream of consciousness to capture the flow of thoughts"
  },
  {
    "_id": `lit12_${Date.now()}_003`,
    "content": "In postcolonial criticism, 'subaltern' refers to:",
    "type": "multiple_choice",
    "options": ["Colonial administrators", "Marginalized groups without voice", "Literary genres", "Narrative perspectives"],
    "correctAnswer": "Marginalized groups without voice",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Term from Gramsci, popularized by Spivak to describe the voiceless in colonial contexts"
  },
  {
    "_id": `lit12_${Date.now()}_004`,
    "content": "The term 'defamiliarization' in Russian Formalism means:",
    "type": "multiple_choice",
    "options": ["Making familiar things seem strange", "Removing personal elements", "Creating realistic narratives", "Establishing cultural norms"],
    "correctAnswer": "Making familiar things seem strange",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Shklovsky's concept of making the ordinary appear extraordinary through artistic technique"
  },
  {
    "_id": `lit12_${Date.now()}_005`,
    "content": "In Derrida's deconstruction, 'différance' (with an 'a') suggests:",
    "type": "multiple_choice",
    "options": ["Simple disagreement", "Temporal deferral and spatial difference", "Cultural variations", "Linguistic evolution"],
    "correctAnswer": "Temporal deferral and spatial difference",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Derrida's neologism combines 'differ' and 'defer' to challenge fixed meaning"
  },
  {
    "_id": `lit12_${Date.now()}_006`,
    "content": "In Joyce's 'Ulysses', the 'Oxen of the Sun' episode demonstrates:",
    "type": "multiple_choice",
    "options": ["Evolution of English prose style", "Mythological parallels", "Dublin geography", "Character development"],
    "correctAnswer": "Evolution of English prose style",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Joyce traces the development of English literature from Anglo-Saxon to modern times"
  },
  {
    "_id": `lit12_${Date.now()}_007`,
    "content": "Bakhtin's concept of 'heteroglossia' refers to:",
    "type": "multiple_choice",
    "options": ["Multiple languages in one text", "Diverse voices and discourses", "Foreign translations", "Dialect variations"],
    "correctAnswer": "Diverse voices and discourses",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "The coexistence of multiple social voices within a single work"
  },
  {
    "_id": `lit12_${Date.now()}_008`,
    "content": "In feminist criticism, 'écriture féminine' advocates for:",
    "type": "multiple_choice",
    "options": ["Women-only publishing", "Feminine writing style", "Gender-neutral language", "Historical accuracy"],
    "correctAnswer": "Feminine writing style",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Cixous and others promoted writing that reflects feminine experience and consciousness"
  },
  {
    "_id": `lit12_${Date.now()}_009`,
    "content": "The 'anxiety of influence' theory by Harold Bloom suggests:",
    "type": "multiple_choice",
    "options": ["Writers fear plagiarism", "Poets struggle against predecessors", "Authors avoid controversy", "Influence corrupts creativity"],
    "correctAnswer": "Poets struggle against predecessors",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Strong poets must overcome the influence of their literary fathers through creative misreading"
  },
  {
    "_id": `lit12_${Date.now()}_010`,
    "content": "In New Historicism, literature is viewed as:",
    "type": "multiple_choice",
    "options": ["Autonomous art", "Historical document", "Cultural product", "Aesthetic object"],
    "correctAnswer": "Cultural product",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Texts are seen as embedded in and shaped by their historical and cultural contexts"
  },
  {
    "_id": `lit12_${Date.now()}_011`,
    "content": "Kristeva's concept of 'intertextuality' means:",
    "type": "multiple_choice",
    "options": ["Footnotes and references", "Dialogue between texts", "Translation studies", "Comparative literature"],
    "correctAnswer": "Dialogue between texts",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Every text exists in relation to other texts, creating meaning through these relationships"
  },
  {
    "_id": `lit12_${Date.now()}_012`,
    "content": "In Lacanian psychoanalysis, the 'mirror stage' represents:",
    "type": "multiple_choice",
    "options": ["Self-recognition", "Ego formation", "Language acquisition", "Oedipal complex"],
    "correctAnswer": "Ego formation",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "The child's identification with its mirror image forms the basis of the ego"
  },
  {
    "_id": `lit12_${Date.now()}_013`,
    "content": "Foucault's concept of 'discourse' in literary analysis refers to:",
    "type": "multiple_choice",
    "options": ["Conversation in novels", "Power structures in language", "Academic discussions", "Rhetorical techniques"],
    "correctAnswer": "Power structures in language",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Discourse shapes knowledge and power relations through language and representation"
  },
  {
    "_id": `lit12_${Date.now()}_014`,
    "content": "The 'carnivalesque' in Bakhtin's theory involves:",
    "type": "multiple_choice",
    "options": ["Circus imagery", "Temporary social inversion", "Comic relief", "Festival descriptions"],
    "correctAnswer": "Temporary social inversion",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Carnival temporarily overturns social hierarchies and conventional values"
  },
  {
    "_id": `lit12_${Date.now()}_015`,
    "content": "In reader-response theory, the 'implied reader' is:",
    "type": "multiple_choice",
    "options": ["The actual audience", "The ideal reader envisioned by the text", "The author's intended audience", "The critic analyzing the work"],
    "correctAnswer": "The ideal reader envisioned by the text",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "The reader role that the text itself creates and assumes"
  },
  {
    "_id": `lit12_${Date.now()}_016`,
    "content": "Jameson's concept of 'political unconscious' suggests:",
    "type": "multiple_choice",
    "options": ["Hidden political messages", "Unconscious political biases", "History as repressed subtext", "Political psychology"],
    "correctAnswer": "History as repressed subtext",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "All texts contain traces of historical contradictions and social conflicts"
  },
  {
    "_id": `lit12_${Date.now()}_017`,
    "content": "In deconstruction, 'logocentrism' refers to:",
    "type": "multiple_choice",
    "options": ["Logo design", "Logical reasoning", "Privileging speech over writing", "Central themes"],
    "correctAnswer": "Privileging speech over writing",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Western philosophy's tendency to privilege presence and speech as more authentic than writing"
  },
  {
    "_id": `lit12_${Date.now()}_018`,
    "content": "Said's 'Orientalism' critiques:",
    "type": "multiple_choice",
    "options": ["Eastern philosophy", "Western representations of the East", "Translation problems", "Cultural exchange"],
    "correctAnswer": "Western representations of the East",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "How Western discourse constructs and dominates the Orient through knowledge and representation"
  },
  {
    "_id": `lit12_${Date.now()}_019`,
    "content": "In trauma theory, 'acting out' versus 'working through' refers to:",
    "type": "multiple_choice",
    "options": ["Performance vs. analysis", "Repetition vs. integration", "Drama vs. therapy", "Action vs. thought"],
    "correctAnswer": "Repetition vs. integration",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Acting out repeats trauma compulsively; working through integrates it into narrative"
  },
  {
    "_id": `lit12_${Date.now()}_020`,
    "content": "Spivak's question 'Can the subaltern speak?' addresses:",
    "type": "multiple_choice",
    "options": ["Language barriers", "Voice and representation", "Free speech rights", "Communication theory"],
    "correctAnswer": "Voice and representation",
    "subject": "English",
    "grade": 12,
    "difficulty": "hard",
    "explanation": "Whether marginalized groups can represent themselves or are always spoken for by others"
  }
];

// Update files
const mathLocations = [
  '/workspaces/AWSQCLI/testace-app/public/questions/12_hard_math.json',
  '/workspaces/AWSQCLI/testace-app/frontend/public/questions/12_hard_math.json'
];

const englishLocations = [
  '/workspaces/AWSQCLI/testace-app/public/questions/12_hard_english.json',
  '/workspaces/AWSQCLI/testace-app/frontend/public/questions/12_hard_english.json'
];

for (const location of mathLocations) {
  if (fs.existsSync(location)) {
    fs.writeFileSync(location, JSON.stringify(grade12HardMath, null, 2));
    console.log(`✅ Updated ${location} with 20 advanced calculus questions`);
  }
}

for (const location of englishLocations) {
  if (fs.existsSync(location)) {
    fs.writeFileSync(location, JSON.stringify(grade12HardEnglish, null, 2));
    console.log(`✅ Updated ${location} with 20 advanced literary theory questions`);
  }
}

console.log('\n🎯 GRADE 12 HARD SUBJECTS EXPANDED TO 20 QUESTIONS EACH!');
console.log('✅ Math: Advanced calculus, differential equations, series, multivariable calculus');
console.log('✅ English: Literary theory, postcolonial criticism, deconstruction, psychoanalysis');
console.log('✅ All questions are university-level challenging');
console.log('\n📝 Refresh your browser to see all 20 questions in each subject!');
