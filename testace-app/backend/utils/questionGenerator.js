const crypto = require('crypto');

class MathQuestionGenerator {
  constructor() {
    this.templates = {
      1: {
        easy: [
          { type: 'addition', range: [1, 10], format: 'What is {a} + {b}?' },
          { type: 'subtraction', range: [1, 10], format: 'What is {a} - {b}?' },
          { type: 'counting', range: [1, 20], format: 'Count: {symbols}. How many?' }
        ],
        medium: [
          { type: 'addition', range: [10, 50], format: 'What is {a} + {b}?' },
          { type: 'subtraction', range: [10, 50], format: 'What is {a} - {b}?' },
          { type: 'skip_counting', range: [2, 10], format: 'Count by {a}s: {sequence}, ?' }
        ],
        hard: [
          { type: 'addition', range: [50, 100], format: 'What is {a} + {b}?' },
          { type: 'subtraction', range: [50, 100], format: 'What is {a} - {b}?' },
          { type: 'multiplication', range: [2, 5], format: 'What is {a} × {b}?' }
        ]
      },
      5: {
        easy: [
          { type: 'decimal_add', range: [0.1, 10], format: 'What is {a} + {b}?' },
          { type: 'fraction_add', range: [1, 8], format: 'What is {a}/{d} + {b}/{d}?' },
          { type: 'percentage', range: [10, 50], format: 'What is {a}% of {b}?' }
        ],
        medium: [
          { type: 'multiplication', range: [12, 25], format: 'What is {a} × {b}?' },
          { type: 'division', range: [100, 200], format: 'What is {a} ÷ {b}?' },
          { type: 'mixed_fraction', range: [2, 12], format: 'What is {a}/{b} + {c}/{d}?' }
        ],
        hard: [
          { type: 'complex_decimal', range: [10, 100], format: 'What is {a} × {b}?' },
          { type: 'percentage_complex', range: [60, 95], format: 'What is {a}% of {b}?' },
          { type: 'fraction_multiply', range: [2, 15], format: 'What is {a}/{b} × {c}/{d}?' }
        ]
      },
      9: {
        easy: [
          { type: 'linear_eval', range: [1, 10], format: 'What is {a}x + {b} when x = {c}?' },
          { type: 'square_root', range: [1, 12], format: 'What is √{a}?' },
          { type: 'square', range: [1, 15], format: 'What is {a}²?' }
        ],
        medium: [
          { type: 'linear_solve', range: [2, 20], format: 'Solve: {a}x + {b} = {c}' },
          { type: 'quadratic_factor', range: [1, 8], format: 'Factor: x² + {a}x + {b}' },
          { type: 'slope', range: [1, 10], format: 'Slope between ({a}, {b}) and ({c}, {d})?' }
        ],
        hard: [
          { type: 'quadratic_solve', range: [1, 12], format: 'Solve: x² + {a}x + {b} = 0' },
          { type: 'absolute_value', range: [1, 20], format: 'Solve: |x - {a}| = {b}' },
          { type: 'exponential', range: [2, 5], format: 'Solve: {a}^x = {b}' }
        ]
      },
      12: {
        easy: [
          { type: 'derivative_basic', range: [1, 5], format: 'Derivative of f(x) = {a}x²?' },
          { type: 'integral_basic', range: [1, 8], format: 'What is ∫{a}x dx?' },
          { type: 'trig_basic', range: [0, 90], format: 'What is sin({a}°)?' }
        ],
        medium: [
          { type: 'derivative_chain', range: [1, 5], format: 'Derivative of f(x) = sin({a}x)?' },
          { type: 'integral_power', range: [2, 6], format: 'What is ∫x^{a} dx?' },
          { type: 'limit_basic', range: [1, 10], format: 'lim(x→{a}) (x² - {b})/(x - {a})?' }
        ],
        hard: [
          { type: 'derivative_product', range: [1, 4], format: 'Derivative of f(x) = x^{a} × e^x?' },
          { type: 'integral_parts', range: [1, 3], format: 'What is ∫x × e^x dx?' },
          { type: 'limit_complex', range: [0, 1], format: 'lim(x→0) sin({a}x)/x?' }
        ]
      }
    };
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomDecimal(min, max, decimals = 1) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
  }

  gcd(a, b) {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  generateQuestion(grade, difficulty, count = 1) {
    const questions = [];
    const templates = this.templates[grade]?.[difficulty] || this.templates[1].easy;

    for (let i = 0; i < count; i++) {
      const template = templates[this.random(0, templates.length - 1)];
      const question = this.createQuestion(template, grade, difficulty, i);
      questions.push(question);
    }

    return count === 1 ? questions[0] : questions;
  }

  createQuestion(template, grade, difficulty, index) {
    const id = `${difficulty}${grade}_${Date.now()}_${index.toString().padStart(3, '0')}`;
    let content, options, correct, explanation;

    switch (template.type) {
      case 'addition':
        const [a1, b1] = [this.random(...template.range), this.random(...template.range)];
        const sum = a1 + b1;
        content = template.format.replace('{a}', a1).replace('{b}', b1);
        options = this.generateOptions(sum, 'integer');
        correct = sum.toString();
        explanation = `${a1} + ${b1} = ${sum}`;
        break;

      case 'subtraction':
        const a2 = this.random(...template.range);
        const b2 = this.random(1, a2);
        const diff = a2 - b2;
        content = template.format.replace('{a}', a2).replace('{b}', b2);
        options = this.generateOptions(diff, 'integer');
        correct = diff.toString();
        explanation = `${a2} - ${b2} = ${diff}`;
        break;

      case 'multiplication':
        const [a3, b3] = [this.random(...template.range), this.random(...template.range)];
        const prod = a3 * b3;
        content = template.format.replace('{a}', a3).replace('{b}', b3);
        options = this.generateOptions(prod, 'integer');
        correct = prod.toString();
        explanation = `${a3} × ${b3} = ${prod}`;
        break;

      case 'division':
        const divisor = this.random(template.range[0]/10, template.range[1]/10);
        const quotient = this.random(8, 25);
        const dividend = divisor * quotient;
        content = template.format.replace('{a}', dividend).replace('{b}', divisor);
        options = this.generateOptions(quotient, 'integer');
        correct = quotient.toString();
        explanation = `${dividend} ÷ ${divisor} = ${quotient}`;
        break;

      case 'decimal_add':
        const d1 = this.randomDecimal(...template.range);
        const d2 = this.randomDecimal(...template.range);
        const dsum = parseFloat((d1 + d2).toFixed(1));
        content = template.format.replace('{a}', d1).replace('{b}', d2);
        options = this.generateOptions(dsum, 'decimal');
        correct = dsum.toString();
        explanation = `${d1} + ${d2} = ${dsum}`;
        break;

      case 'percentage':
        const percent = this.random(...template.range);
        const base = this.random(20, 200);
        const result = Math.round(base * percent / 100);
        content = template.format.replace('{a}', percent).replace('{b}', base);
        options = this.generateOptions(result, 'integer');
        correct = result.toString();
        explanation = `${percent}% of ${base} = ${result}`;
        break;

      case 'linear_eval':
        const coef = this.random(...template.range);
        const const1 = this.random(...template.range);
        const x_val = this.random(1, 5);
        const eval_result = coef * x_val + const1;
        content = template.format.replace('{a}', coef).replace('{b}', const1).replace('{c}', x_val);
        options = this.generateOptions(eval_result, 'integer');
        correct = eval_result.toString();
        explanation = `${coef}(${x_val}) + ${const1} = ${eval_result}`;
        break;

      case 'square_root':
        const perfect_squares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
        const square_val = perfect_squares[this.random(0, Math.min(template.range[1], perfect_squares.length - 1))];
        const sqrt_result = Math.sqrt(square_val);
        content = template.format.replace('{a}', square_val);
        options = this.generateOptions(sqrt_result, 'integer');
        correct = sqrt_result.toString();
        explanation = `√${square_val} = ${sqrt_result}`;
        break;

      case 'derivative_basic':
        const coef_d = this.random(...template.range);
        const power = 2;
        const deriv_coef = coef_d * power;
        content = template.format.replace('{a}', coef_d);
        options = [`${deriv_coef}x`, `${coef_d}x`, `${coef_d}x²`, `${deriv_coef}`];
        correct = `${deriv_coef}x`;
        explanation = `d/dx(${coef_d}x²) = ${deriv_coef}x`;
        break;

      default:
        // Fallback to simple addition
        const [fa, fb] = [this.random(1, 20), this.random(1, 20)];
        const fsum = fa + fb;
        content = `What is ${fa} + ${fb}?`;
        options = this.generateOptions(fsum, 'integer');
        correct = fsum.toString();
        explanation = `${fa} + ${fb} = ${fsum}`;
    }

    return {
      _id: id,
      content,
      type: "multiple_choice",
      options,
      correct_answer: correct,
      subject: "Mathematics",
      grade,
      difficulty,
      explanation
    };
  }

  generateOptions(correct, type = 'integer') {
    const options = [correct];
    
    while (options.length < 4) {
      let option;
      if (type === 'decimal') {
        const variation = this.randomDecimal(-2, 2);
        option = parseFloat((correct + variation).toFixed(1));
      } else {
        const variation = this.random(-3, 3);
        option = Math.max(0, correct + variation);
      }
      
      if (!options.includes(option) && option !== correct) {
        options.push(option);
      }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return options.map(opt => opt.toString());
  }
}

// Export for use
module.exports = MathQuestionGenerator;

// Example usage and testing
if (require.main === module) {
  const generator = new MathQuestionGenerator();
  
  console.log('=== GRADE 1 EASY ===');
  console.log(JSON.stringify(generator.generateQuestion(1, 'easy'), null, 2));
  
  console.log('\n=== GRADE 5 MEDIUM ===');
  console.log(JSON.stringify(generator.generateQuestion(5, 'medium'), null, 2));
  
  console.log('\n=== GRADE 9 HARD ===');
  console.log(JSON.stringify(generator.generateQuestion(9, 'hard'), null, 2));
  
  console.log('\n=== GRADE 12 MEDIUM ===');
  console.log(JSON.stringify(generator.generateQuestion(12, 'medium'), null, 2));
  
  console.log('\n=== BULK GENERATION (5 questions) ===');
  const bulk = generator.generateQuestion(5, 'easy', 5);
  bulk.forEach((q, i) => {
    console.log(`${i+1}. ${q.content} → ${q.correct_answer}`);
  });
}
