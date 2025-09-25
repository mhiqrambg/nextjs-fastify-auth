import * as yup from "yup";
import { ISignin } from "@/types/Auth";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { extractErrorMessage } from "@/utils/error";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

const LoginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters"),
});

export function useLogin() {
  const router = useRouter();
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

  const callbackUrl = (router.query.callbackUrl as string) || "/";

  const loginService = async (payload: ISignin) => {
    const res = await signIn("credentials", {
      ...payload,
      redirect: false,
      callbackUrl,
    });
    if (res?.error && res.status === 401) {
      throw new Error("Email or password is incorrect");
    }
  };

  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: loginService,
    onSuccess: async () => {
      router.push(callbackUrl);
      reset();
    },
    onError: (err: any) => {
      const message = extractErrorMessage(err);
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
  };
}
