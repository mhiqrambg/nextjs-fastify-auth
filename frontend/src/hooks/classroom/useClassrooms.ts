import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classroomService } from "@/services/classroom";
import type {
  ICreateClassroomInput,
  IJoinClassroomInput,
} from "@/types/Classroom";

interface UseClassroomsParams {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: string;
}

export function useClassrooms(params?: UseClassroomsParams) {
  return useQuery({
    queryKey: ["classrooms", params],
    queryFn: async () => {
      const res = await classroomService.getClassrooms(params);
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useClassroom(classroomId: string) {
  return useQuery({
    queryKey: ["classroom", classroomId],
    queryFn: async () => {
      const res = await classroomService.getClassroomById(classroomId);
      return res.data;
    },
    enabled: !!classroomId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useClassroomMembers(classroomId: string) {
  return useQuery({
    queryKey: ["classroom-members", classroomId],
    queryFn: async () => {
      const res = await classroomService.getClassroomMembers(classroomId);
      return res.data;
    },
    enabled: !!classroomId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useClassroomExams(classroomId: string) {
  return useQuery({
    queryKey: ["classroom-exams", classroomId],
    queryFn: async () => {
      const res = await classroomService.getClassroomExams(classroomId);
      return res.data;
    },
    enabled: !!classroomId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateClassroomInput) =>
      classroomService.createClassroom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });
}

export function useJoinClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IJoinClassroomInput) =>
      classroomService.joinClassroom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });
}

export function useUpdateMemberProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { classroom_id: string; progress: number }) =>
      classroomService.updateMemberProgress(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["classroom-members", variables.classroom_id],
      });
    },
  });
}
