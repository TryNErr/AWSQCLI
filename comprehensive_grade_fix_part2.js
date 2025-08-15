// Part 2: Reading and Thinking Skills templates

const readingAndThinkingQuestions = {
  reading: {
    1: {
      easy: [
        { content: "Read this story: 'The cat sat on the mat. The cat was happy.' What did the cat do?", options: ["Ran", "Sat", "Jumped", "Slept"], correct: 1, explanation: "The story says the cat sat on the mat" },
        { content: "Read: 'Tom has a red ball. He likes to play with it.' What color is Tom's ball?", options: ["Blue", "Red", "Green", "Yellow"], correct: 1, explanation: "The story says Tom has a red ball" },
        { content: "Read: 'The sun is bright. It makes the day warm.' What makes the day warm?", options: ["The moon", "The sun", "The stars", "The clouds"], correct: 1, explanation: "The story says the sun makes the day warm" },
        { content: "Read: 'Birds can fly. They have wings.' What helps birds fly?", options: ["Legs", "Wings", "Tails", "Beaks"], correct: 1, explanation: "The story says birds have wings to fly" },
        { content: "Read: 'Mom made cookies. They smell good.' Who made cookies?", options: ["Dad", "Mom", "Sister", "Brother"], correct: 1, explanation: "The story says Mom made cookies" }
      ]
    },
    6: {
      medium: [
        { content: "Read this passage: 'The Amazon rainforest is home to millions of species. Scientists estimate that many species remain undiscovered. Deforestation threatens this biodiversity.' What is the main concern?", options: ["Too many scientists", "Undiscovered species", "Deforestation threatening biodiversity", "Amazon location"], correct: 2, explanation: "The passage emphasizes that deforestation threatens biodiversity" },
        { content: "Read: 'Photosynthesis is the process by which plants make food using sunlight, water, and carbon dioxide. This process produces oxygen as a byproduct.' What do plants need for photosynthesis?", options: ["Only sunlight", "Sunlight, water, and carbon dioxide", "Only water", "Only carbon dioxide"], correct: 1, explanation: "The passage lists sunlight, water, and carbon dioxide as requirements" },
        { content: "Read: 'The water cycle includes evaporation, condensation, and precipitation. This continuous process distributes water around Earth.' What are the three main parts of the water cycle?", options: ["Rain, snow, hail", "Evaporation, condensation, precipitation", "Clouds, rivers, oceans", "Heat, cold, wind"], correct: 1, explanation: "The passage specifically names evaporation, condensation, and precipitation" }
      ]
    },
    9: {
      hard: [
        { content: "Read this literary analysis: 'In Orwell's 1984, the concept of doublethink represents the psychological manipulation inherent in totalitarian regimes. Citizens must simultaneously hold contradictory beliefs.' What does doublethink represent?", options: ["Simple confusion", "Psychological manipulation in totalitarian regimes", "Educational methods", "Communication problems"], correct: 1, explanation: "The passage states doublethink represents psychological manipulation in totalitarian regimes" },
        { content: "Analyze this passage: 'The protagonist's internal conflict between duty and desire creates dramatic tension throughout the narrative, ultimately leading to the climactic confrontation.' What creates dramatic tension?", options: ["External events", "Internal conflict between duty and desire", "Character dialogue", "Setting changes"], correct: 1, explanation: "The passage identifies internal conflict between duty and desire as creating dramatic tension" },
        { content: "Read: 'The author's use of symbolism in the recurring motif of the broken mirror reflects the fragmented nature of the protagonist's identity.' What does the broken mirror symbolize?", options: ["Bad luck", "Fragmented identity", "Vanity", "Time passing"], correct: 1, explanation: "The passage states the broken mirror reflects the fragmented nature of the protagonist's identity" }
      ]
    },
    12: {
      hard: [
        { content: "Analyze this critical theory passage: 'Postcolonial literature often employs narrative techniques that subvert traditional Western literary forms, creating a discourse that challenges hegemonic cultural assumptions.' What is the primary function of these narrative techniques?", options: ["Entertainment", "Subverting Western forms to challenge cultural hegemony", "Preserving tradition", "Simplifying complex ideas"], correct: 1, explanation: "The passage states these techniques subvert Western forms to challenge hegemonic cultural assumptions" },
        { content: "Read this philosophical text: 'The phenomenological approach to consciousness emphasizes the intentional structure of experience, wherein consciousness is always consciousness of something.' What does phenomenology emphasize?", options: ["Unconscious processes", "The intentional structure of experience", "Behavioral responses", "Social influences"], correct: 1, explanation: "The passage states phenomenology emphasizes the intentional structure of experience" },
        { content: "Analyze: 'The intertextual relationships between modernist works create a palimpsest of meaning, where each text both conceals and reveals layers of cultural significance.' What do intertextual relationships create?", options: ["Simple connections", "A palimpsest of meaning with cultural layers", "Confusion", "Historical accuracy"], correct: 1, explanation: "The passage describes intertextual relationships creating a palimpsest of meaning with cultural layers" }
      ]
    }
  },

  'thinking-skills': {
    1: {
      easy: [
        { content: "Complete the pattern: Red, Blue, Red, Blue, ?", options: ["Green", "Red", "Yellow", "Purple"], correct: 1, explanation: "The pattern alternates Red, Blue, so Red comes next" },
        { content: "If you have 3 apples and eat 1, how many do you have left?", options: ["1", "2", "3", "4"], correct: 1, explanation: "3 - 1 = 2 apples left" },
        { content: "Which one is different: Cat, Dog, Bird, Car", options: ["Cat", "Dog", "Bird", "Car"], correct: 3, explanation: "Car is not an animal like the others" },
        { content: "What comes next: 1, 2, 3, ?", options: ["3", "4", "5", "6"], correct: 1, explanation: "The numbers increase by 1, so 4 comes next" },
        { content: "If all toys are fun, and blocks are toys, then blocks are:", options: ["Boring", "Fun", "Hard", "Square"], correct: 1, explanation: "Since all toys are fun and blocks are toys, blocks must be fun" }
      ]
    },
    6: {
      medium: [
        { content: "Complete the pattern: 2, 6, 18, 54, ?", options: ["108", "162", "216", "270"], correct: 1, explanation: "Each number is multiplied by 3: 54 × 3 = 162" },
        { content: "If it takes 4 people 4 hours to dig 4 holes, how long does it take 1 person to dig 1 hole?", options: ["1 hour", "2 hours", "4 hours", "8 hours"], correct: 2, explanation: "Each person digs 1 hole in 4 hours" },
        { content: "A farmer has chickens and rabbits. There are 20 heads and 56 legs. How many rabbits?", options: ["6", "8", "10", "12"], correct: 1, explanation: "Let r = rabbits, c = chickens. r + c = 20, 4r + 2c = 56. Solving: r = 8" },
        { content: "Which number doesn't belong: 2, 4, 6, 9, 10", options: ["2", "4", "6", "9"], correct: 3, explanation: "9 is odd, all others are even" },
        { content: "If A = 1, B = 2, C = 3, what does CAB equal?", options: ["312", "321", "123", "132"], correct: 0, explanation: "C=3, A=1, B=2, so CAB = 312" }
      ]
    },
    9: {
      hard: [
        { content: "A snail climbs up a 10-meter wall. Each day it climbs 3 meters up, but each night it slides 2 meters down. How many days to reach the top?", options: ["7 days", "8 days", "9 days", "10 days"], correct: 1, explanation: "After 7 days it's at 7m. On day 8, it climbs 3m to reach 10m before sliding back" },
        { content: "In a tournament with 64 teams, each game eliminates one team. How many games are needed to determine the winner?", options: ["32", "63", "64", "128"], correct: 1, explanation: "To eliminate 63 teams (leaving 1 winner), you need 63 games" },
        { content: "If you rearrange the letters 'LISTEN', you can spell:", options: ["SILENT", "ENLIST", "TINSEL", "All of the above"], correct: 3, explanation: "LISTEN can be rearranged to spell SILENT, ENLIST, and TINSEL" },
        { content: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["0°", "7.5°", "15°", "22.5°"], correct: 1, explanation: "At 3:15, the minute hand is at 90° and hour hand at 97.5°, difference is 7.5°" },
        { content: "Complete the sequence: 1, 1, 2, 3, 5, 8, ?", options: ["11", "13", "15", "21"], correct: 1, explanation: "This is the Fibonacci sequence: 5 + 8 = 13" }
      ]
    },
    12: {
      hard: [
        { content: "In formal logic, if P → Q and ¬Q, what can we conclude about P?", options: ["P is true", "¬P (P is false)", "P is unknown", "P → Q is false"], correct: 1, explanation: "By modus tollens: if P implies Q and Q is false, then P must be false" },
        { content: "A paradox: 'This statement is false.' If the statement is true, then it's false. If it's false, then it's true. This is an example of:", options: ["Logical fallacy", "Self-reference paradox", "Circular reasoning", "Invalid argument"], correct: 1, explanation: "This is a classic self-reference paradox where the statement refers to itself" },
        { content: "In game theory, what is a Nash equilibrium?", options: ["When all players win", "When no player can improve by changing strategy alone", "When the game ends", "When players cooperate"], correct: 1, explanation: "A Nash equilibrium occurs when no player can unilaterally improve their outcome" },
        { content: "Solve this cryptarithmetic puzzle: SEND + MORE = MONEY. What does M equal?", options: ["0", "1", "2", "9"], correct: 1, explanation: "In this puzzle, M must equal 1 (the carry from the thousands column)" },
        { content: "In probability, if events A and B are independent with P(A) = 0.3 and P(B) = 0.4, what is P(A ∪ B)?", options: ["0.58", "0.70", "0.12", "0.88"], correct: 0, explanation: "P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.3 + 0.4 - (0.3 × 0.4) = 0.58" }
      ]
    }
  }
};

module.exports = { readingAndThinkingQuestions };
