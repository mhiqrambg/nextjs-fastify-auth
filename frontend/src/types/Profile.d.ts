export type UserRole = "admin" | "teacher" | "student" | "user";

export interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: UserRole;
  tv: number;
  phone_number: string;
  phone_verified_at: string | null;
  email_verified_at: string | null;
}

export interface ProfileForm {
  id: string;
  name: string;
  email: string;
  password: string;
  re_password: string;
  phone_number: string;
  phone_verified_at: string | null;
  email_verified_at: string | null;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
