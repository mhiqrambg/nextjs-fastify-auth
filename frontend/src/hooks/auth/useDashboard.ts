import userService from "@/services/user";

export function useDashboard() {
  const dashboardService = async () => {
    const res = await userService.dashboard();
    return res;
  };

  return { dashboardService };
}
