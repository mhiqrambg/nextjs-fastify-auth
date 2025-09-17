import React from "react";
import * as yup from "yup";

export type Selected = "login" | "register" | "otp" | "forgotpassword";

export function useRegister() {
  const RegisterSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup.string().required("Confirm password is required"),
  });

  const [selected, setSelected] = React.useState<Selected>("login");
  const [otp, setOtp] = React.useState("");

  return {
    selected,
    setSelected,
    otp,
    setOtp,
  };
}
