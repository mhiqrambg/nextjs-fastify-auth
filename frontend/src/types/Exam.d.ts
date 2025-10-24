export interface IExam {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  total_questions: number;
  passing_score: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface IQuestion {
  id: string;
  exam_id: string;
  question: string;
  options: IQuestionOption[];
  correct_answer: string;
  explanation?: string;
  points: number;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface IQuestionOption {
  id: string;
  text: string;
  value: string;
}

export interface IExamAttempt {
  id: string;
  exam_id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  score?: number;
  status: "in_progress" | "completed" | "submitted";
  time_remaining?: number; // in seconds
  created_at: string;
  updated_at: string;
}

export interface IExamAnswer {
  id?: string;
  attempt_id?: string;
  question_id: string;
  selected_answer: string;
  is_correct?: boolean;
  points?: number;
  created_at?: string;
}

export interface IExamResult {
  id: string;
  attempt_id: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  percentage: number;
  passed: boolean;
  completed_at: string;
  time_taken: number; // in minutes
}

export interface IExamSession {
  examId: string;
  attemptId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeRemaining: number;
  startTime: string;
}
