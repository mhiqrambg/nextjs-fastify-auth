import { useQuery } from "@tanstack/react-query";
import userService from "@/services/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useProfile() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isEnabled = isMounted && status === "authenticated" && !!session;

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await userService.getProfile();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: isEnabled,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
