export interface IExam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IQuestion {
  id: string;
  examId: string;
  question: string;
  options: IQuestionOption[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  order: number;
}

export interface IQuestionOption {
  id: string;
  text: string;
  value: string;
}

export interface IExamAttempt {
  id: string;
  examId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  answers: IExamAnswer[];
  score?: number;
  status: "in_progress" | "completed" | "submitted";
  timeRemaining?: number; // in seconds
}

export interface IExamAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect?: boolean;
  points?: number;
}

export interface IExamResult {
  id: string;
  examAttemptId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  timeTaken: number; // in minutes
  answers: IExamAnswer[];
}

export interface IExamSession {
  examId: string;
  attemptId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeRemaining: number;
  startTime: string;
}
