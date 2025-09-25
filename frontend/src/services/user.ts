import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";

const userService = {
  getProfileWithToken: (token: String) =>
    instance.get(endpoint.USER + "/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  dashboard: () => instance.get(endpoint.USER + "/dashboard"),
};

export default userService;
