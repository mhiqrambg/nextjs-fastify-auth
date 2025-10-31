import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
  const paramsKey = JSON.stringify(params);

  return useQuery({
    queryKey: ["exams", paramsKey],
    queryFn: async () => {
      const res = await examService.getExams(params);
      return res;
    },

    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useExam(examId: string) {
  return useQuery({
    queryKey: ["exam", examId],
    queryFn: async () => {
      const exam = await examService.getExamById(examId);
      return exam.data;
    },
    enabled: !!examId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (examId: string) => {
      await examService.deleteExam(examId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: (error) => {
      console.error("Gagal menghapus ujian:", error);
    },
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
