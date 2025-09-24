// src/hooks/useLogin.tsx

import { useDisclosure } from "@heroui/react";
import * as yup from "yup";
import { ISignin } from "@/types/Auth";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const LoginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters"),
});

export function useLogin() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const loginService = async (payload: ISignin) => {
    const res = await authService.signin(payload);
    return res;
  };

  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: loginService,
    onSuccess: () => {
      onClose();
      reset();
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";
      setError("root", { message });
    },
  });

  const handleLogin = (data: ISignin) => mutateLogin(data);

  return {
    isPendingLogin,
    handleLogin,
    control,
    errors,
    handleSubmit,
    isOpen,
    onOpen,
    onOpenChange,
    onClose,
  };
}
