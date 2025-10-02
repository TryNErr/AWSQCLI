export interface UserProgress {
  correctlyAnswered: Set<string>; // Question IDs that were answered correctly
}

class UserProgressManager {
  private static STORAGE_KEY = 'testace_user_progress';

  static getProgress(): UserProgress {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          correctlyAnswered: new Set(parsed.correctlyAnswered || [])
        };
      }
    } catch (error) {
      console.warn('Failed to load user progress:', error);
    }
    return { correctlyAnswered: new Set() };
  }

  static saveProgress(progress: UserProgress): void {
    try {
      const toStore = {
        correctlyAnswered: Array.from(progress.correctlyAnswered)
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.warn('Failed to save user progress:', error);
    }
  }

  static markCorrect(questionId: string): void {
    const progress = this.getProgress();
    progress.correctlyAnswered.add(questionId);
    this.saveProgress(progress);
  }

  static markIncorrect(questionId: string): void {
    const progress = this.getProgress();
    progress.correctlyAnswered.delete(questionId);
    this.saveProgress(progress);
  }

  static isCorrectlyAnswered(questionId: string): boolean {
    const progress = this.getProgress();
    return progress.correctlyAnswered.has(questionId);
  }
}

export default UserProgressManager;
