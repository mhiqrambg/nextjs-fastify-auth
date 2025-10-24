import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";

export const userService = {
  getProfile: () => instance.get(endpoint.USER + "/me"),
  getProfileWithToken: (token: string) =>
    instance.get(endpoint.USER + "/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      skipAuth: true,
    }),
  dashboard: () => instance.get(endpoint.USER + "/dashboard"),
  updateUser: (payload: { name: string }) =>
    instance.put(endpoint.USER + "/", payload),
  updatePassword: (payload: { password: string }) =>
    instance.put(endpoint.USER + "/", payload),
};

export default userService;
