export interface Question {
  id: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
  grade: number;
  difficulty: number;
  subject: string;
  passage?: string;
}
