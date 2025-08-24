#!/bin/bash

# Simple script to interact with your local Ollama model
MODEL="deepseek-r1:latest"

echo "🤖 Ollama Chat Helper"
echo "Model: $MODEL"
echo "Commands:"
echo "  ./chat_with_ollama.sh interactive  - Start interactive chat"
echo "  ./chat_with_ollama.sh ask \"question\" - Ask a single question"
echo "  ./chat_with_ollama.sh code \"task\" - Ask for code help"
echo ""

case "$1" in
    "interactive")
        echo "Starting interactive chat with $MODEL..."
        echo "Type 'exit' or press Ctrl+C to quit"
        ollama run $MODEL
        ;;
    "ask")
        if [ -z "$2" ]; then
            echo "Usage: $0 ask \"your question\""
            exit 1
        fi
        echo "Question: $2"
        echo "Answer:"
        echo "$2" | ollama run $MODEL
        ;;
    "code")
        if [ -z "$2" ]; then
            echo "Usage: $0 code \"coding task\""
            exit 1
        fi
        echo "Coding task: $2"
        echo "Solution:"
        echo "$2" | ollama run $MODEL
        ;;
    *)
        echo "Usage: $0 {interactive|ask|code} [question]"
        echo ""
        echo "Examples:"
        echo "  $0 interactive"
        echo "  $0 ask \"What is machine learning?\""
        echo "  $0 code \"Write a function to sort a list in Python\""
        ;;
esac
