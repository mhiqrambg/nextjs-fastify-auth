import { JWT } from "next-auth/jwt";
import { User, Session } from "next-auth";

export interface ISignup {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  re_password: string;
}

export interface ISignin {
  email: string;
  password: string;
}

export interface IResetPassword {
  email: string;
}

export interface IVerifyOtp {
  id: string;
  phone_number: string;
  otp: string;
}

export interface UserExtended extends User {
  accessToken?: string;
  refreshToken?: string;
  role?: string;
}

export interface SessionExtended extends Session {
  accessToken?: string;
  refreshToken?: string;
}

export interface JWTExtended extends JWT {
  user?: UserExtended;
}
