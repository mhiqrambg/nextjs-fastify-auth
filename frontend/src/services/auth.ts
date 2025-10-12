import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";
import { ISignup, ISignin, IResetPassword } from "@/types/Auth";

export const authService = {
  signup: (payload: ISignup) =>
    instance.post(endpoint.AUTH + "/signup", payload, { skipAuth: true }),
  signin: (payload: ISignin) =>
    instance.post(endpoint.AUTH + "/signin", payload, { skipAuth: true }),
  verifyOtp: (payload: any) =>
    instance.post(endpoint.AUTH + "/verify-otp", payload, { skipAuth: true }),
  resendOtp: (payload: any) =>
    instance.post(endpoint.AUTH + "/resend-otp", payload),
  resetPassword: (payload: IResetPassword) =>
    instance.post(endpoint.AUTH + "/reset-password", payload),
  refreshToken: (refreshToken: string) =>
    instance.post(
      endpoint.AUTH + "/refresh",
      { refreshToken },
      { skipAuth: true },
    ),
  logout: (refreshToken: string) =>
    instance.post(
      endpoint.AUTH + "/logout",
      { refreshToken },
      { skipAuth: true },
    ),
};

export default authService;
