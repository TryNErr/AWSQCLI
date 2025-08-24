#!/bin/bash

echo "🎯 Ollama Question Generator Demo for TestAce"
echo "=============================================="
echo ""

echo "📋 This system will generate diverse questions to replace duplicates in your TestAce project."
echo ""

echo "🔍 Current duplicate issue example:"
echo "Looking at your reading questions..."

# Show current duplicate issue
head -20 /workspace/AWSQCLI/testace-app/frontend/public/questions/5_easy_reading.json

echo ""
echo "❌ As you can see above, there are duplicate questions with identical content!"
echo ""

echo "✅ The Ollama Question Generator will solve this by:"
echo "   • Using your DeepSeek-R1 model to generate unique questions"
echo "   • Creating age-appropriate content for each grade level"
echo "   • Ensuring educational value and proper difficulty scaling"
echo "   • Eliminating all duplicate questions across all subjects"
echo ""

echo "🚀 Quick Start Commands:"
echo ""
echo "1. Test a single question generation:"
echo "   ./chat_with_ollama.sh ask \"Generate 3 unique Grade 5 easy math questions about fractions with multiple choice answers\""
echo ""
echo "2. Generate questions for specific subjects:"
echo "   node ollama_question_generator.js --subjects math --grades 5 --difficulties easy --backup"
echo ""
echo "3. Generate all questions (full replacement):"
echo "   node ollama_question_generator.js --backup"
echo ""

echo "📊 Expected Results:"
echo "   • 180 question files (5 subjects × 12 grades × 3 difficulties)"
echo "   • 10 unique questions per file = 1,800 total questions"
echo "   • Complete elimination of duplicate content"
echo "   • Educational, age-appropriate questions for each level"
echo ""

echo "⚠️  Important Notes:"
echo "   • Generation takes time (2-5 minutes per file with Ollama)"
echo "   • Use --backup flag to save existing questions"
echo "   • Start with small batches to test (single subject/grade)"
echo "   • Monitor system resources during generation"
echo ""

echo "📖 For detailed instructions, see:"
echo "   cat QUESTION_GENERATOR_GUIDE.md"
echo ""

echo "🎯 Ready to eliminate duplicate questions and create engaging content!"
