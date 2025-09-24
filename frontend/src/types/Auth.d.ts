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
