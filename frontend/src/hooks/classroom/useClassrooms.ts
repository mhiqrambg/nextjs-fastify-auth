import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  UseQueryOptions,
} from "@tanstack/react-query";
import { classroomService } from "@/services/classroom";
import type {
  ICreateClassroomInput,
  IJoinClassroomInput,
  ICreateClassroomForm,
  TClassroomExam,
} from "@/types/Classroom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CloudLightning } from "lucide-react";

const CreateClassroomSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  imageFile: yup.mixed().required("Image is required"),
});

export type TCreateClassroomSchema = yup.InferType<
  typeof CreateClassroomSchema
>;

interface UseClassroomsParams {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: string;
}

export function useClassrooms(params?: UseClassroomsParams) {
  const paramsKey = JSON.stringify(params);

  return useQuery({
    queryKey: ["classrooms", paramsKey],

    queryFn: async () => {
      const res = await classroomService.getClassrooms(params);
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });
}

export function useClassroom(classroomId: string) {
  return useQuery({
    queryKey: ["classroom", classroomId],
    queryFn: async () => {
      const res = await classroomService.getClassroomById(classroomId);

      console.log("res", res.data);
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

export function useClassroomExams(
  classroomId: string,
  options?: Partial<UseQueryOptions<TClassroomExam[]>>,
) {
  return useQuery({
    queryKey: ["classroom-exams", classroomId],
    queryFn: async () => {
      const res = await classroomService.getClassroomExams(classroomId);

      console.log("res", res.data);
      return res.data;
    },
    enabled: !!classroomId && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  const form = useForm<TCreateClassroomSchema>({
    resolver: yupResolver(CreateClassroomSchema),
    mode: "onChange",
    defaultValues: { name: "", description: "", imageFile: null as any },
  });

  const mutation = useMutation({
    mutationFn: (data: ICreateClassroomInput) =>
      classroomService.createClassroom(data),
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";
      form.setError("root", { message });
    },
  });

  const handleCreateClassroom = (v: TCreateClassroomSchema) => {
    const payload: ICreateClassroomInput = {
      name: v.name,
      description: v.description,
      imageFile: v.imageFile as File,
    };
    mutation.mutate(payload);
  };

  const createClassroomAsync = (v: TCreateClassroomSchema) => {
    const payload: ICreateClassroomInput = {
      name: v.name,
      description: v.description,
      imageFile: v.imageFile as File,
    };
    return mutation.mutateAsync(payload);
  };

  return {
    ...form,
    handleCreateClassroom,
    createClassroomAsync,
    isSubmitting: mutation.isPending,
  };
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
