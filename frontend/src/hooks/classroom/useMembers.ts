import { classroomService } from "@/services/classroom";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TClassroomMember } from "@/types/Classroom";

export function useMembers(
  classroomId: string,
  options?: Partial<UseQueryOptions<TClassroomMember[]>>,
) {
  return useQuery({
    queryKey: ["classroom-members", classroomId],
    queryFn: async () => {
      const res = await classroomService.getClassroomMembers(classroomId);
      return res.data;
    },
    enabled: !!classroomId && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}
