import { useQuery } from "@tanstack/react-query";
import userService from "@/services/user";

export function useProfile() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await userService.getProfile();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
