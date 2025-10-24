import { useQuery } from "@tanstack/react-query";
import { examService } from "@/services/exam";

interface UseExamsParams {
  q?: string;
  page?: number;
  pageSize?: number;
  category?: string;
  difficulty?: string;
  sort?: string;
  order?: string;
}

export function useExams(params?: UseExamsParams) {
  return useQuery({
    queryKey: ["exams", params],
    queryFn: async () => {
      const res = await examService.getExams(params);
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes–
  });
}

export function useExam(examId: string) {
  return useQuery({
    queryKey: ["exam", examId],
    queryFn: async () => {
      const res = await examService.getExamById(examId);
      return res.data;
    },
    enabled: !!examId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useExamQuestions(examId: string) {
  return useQuery({
    queryKey: ["exam-questions", examId],
    queryFn: async () => {
      const res = await examService.getExamQuestions(examId);
      return res.data;
    },
    enabled: !!examId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserAttempts() {
  return useQuery({
    queryKey: ["user-attempts"],
    queryFn: async () => {
      const res = await examService.getUserAttempts();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
