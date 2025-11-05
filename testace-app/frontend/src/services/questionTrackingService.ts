// Service to track user's correctly answered questions
class QuestionTrackingService {
  private static STORAGE_KEY = 'user_correct_questions';

  // Get list of correctly answered question IDs
  static getCorrectQuestions(): Set<string> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }

  // Mark question as correctly answered
  static markQuestionCorrect(questionId: string): void {
    const correctQuestions = this.getCorrectQuestions();
    correctQuestions.add(questionId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...correctQuestions]));
  }

  // Mark multiple questions as correct
  static markQuestionsCorrect(questionIds: string[]): void {
    const correctQuestions = this.getCorrectQuestions();
    questionIds.forEach(id => correctQuestions.add(id));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...correctQuestions]));
  }

  // Filter out already correctly answered questions
  static filterUnseenQuestions(questions: any[]): any[] {
    const correctQuestions = this.getCorrectQuestions();
    return questions.filter(q => !correctQuestions.has(q._id));
  }

  // Get statistics
  static getStats(): { totalCorrect: number; percentage: number } {
    const correctQuestions = this.getCorrectQuestions();
    return {
      totalCorrect: correctQuestions.size,
      percentage: 0 // Will be calculated when we know total questions
    };
  }

  // Get list of correctly answered question IDs as array
  static getCorrectlyAnsweredQuestions(): string[] {
    const correctQuestions = this.getCorrectQuestions();
    return [...correctQuestions];
  }

  // Reset tracking (for testing purposes)
  static reset(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export default QuestionTrackingService;
