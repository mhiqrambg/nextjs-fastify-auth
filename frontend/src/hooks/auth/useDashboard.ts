import { authService } from "@/services/auth";

export function useDashboard() {
  const dashboardService = async () => {
    const res = await authService.dashboard();
    return res;
  };

  return { dashboardService };
}
