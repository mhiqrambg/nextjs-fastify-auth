"use client";

import { useState, useEffect, useCallback } from "react";
import { IExam, IQuestion, IExamAttempt, IExamSession } from "@/types/Exam";
import { examService } from "@/services/exam";

interface UseExamSessionProps {
  exam: IExam;
  questions: IQuestion[];
}

export const useExamSession = ({ exam, questions }: UseExamSessionProps) => {
  const [session, setSession] = useState<IExamSession | null>(null);
  const [attempt, setAttempt] = useState<IExamAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize exam session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        const response = await examService.startExamAttempt(exam.id);
        const attemptData = response.data;
        setAttempt(attemptData);

        const newSession: IExamSession = {
          examId: exam.id,
          attemptId: attemptData.id,
          currentQuestionIndex: 0,
          answers: {},
          timeRemaining: exam.duration * 60,
          startTime: new Date().toISOString(),
        };

        setSession(newSession);
      } catch (error) {
        console.error("Failed to initialize exam session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [exam.id, exam.duration]);

  // Update answer for current question
  const updateAnswer = useCallback(
    (answer: string) => {
      const questionId = questions[currentQuestionIndex]?.id;
      if (!questionId) return;

      const newAnswers = { ...answers, [questionId]: answer };
      setAnswers(newAnswers);

      if (session) {
        setSession({ ...session, answers: newAnswers });
      }
    },
    [answers, currentQuestionIndex, questions, session],
  );

  // Navigate to specific question
  const navigateToQuestion = useCallback(
    (questionIndex: number) => {
      if (questionIndex >= 0 && questionIndex < questions.length) {
        setCurrentQuestionIndex(questionIndex);
        if (session) {
          setSession({ ...session, currentQuestionIndex: questionIndex });
        }
      }
    },
    [questions.length, session],
  );

  // Navigate to next question
  const goToNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length, navigateToQuestion]);

  // Navigate to previous question
  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, navigateToQuestion]);

  // Submit exam
  const submitExam = useCallback(async () => {
    if (!attempt) return null;

    try {
      const response = await examService.submitExamAttempt(attempt.id, answers);
      return response.data;
    } catch (error) {
      console.error("Failed to submit exam:", error);
      throw error;
    }
  }, [attempt, answers]);

  // Get current question
  const currentQuestion = questions[currentQuestionIndex] || null;
  const selectedAnswer = currentQuestion
    ? answers[currentQuestion.id] || ""
    : "";

  // Navigation state
  const canGoNext = currentQuestionIndex < questions.length - 1;
  const canGoPrevious = currentQuestionIndex > 0;

  // Progress tracking
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return {
    // State
    session,
    attempt,
    currentQuestionIndex,
    answers,
    isLoading,
    currentQuestion,
    selectedAnswer,

    // Navigation
    canGoNext,
    canGoPrevious,
    navigateToQuestion,
    goToNext,
    goToPrevious,

    // Progress
    answeredCount,
    unansweredCount,
    progress,

    // Actions
    updateAnswer,
    submitExam,
  };
};
