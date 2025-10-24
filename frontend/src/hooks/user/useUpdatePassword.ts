import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { extractErrorMessage } from "@/utils/error";
import { useState } from "react";

const PasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Min 5 chars")
    .matches(/[A-Za-z]/, "Must contain letters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{5,}$/,
      "Must contain special characters",
    )
    .matches(/[0-9]/, "Must contain numbers"),
  re_password: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

type PasswordPayload = yup.InferType<typeof PasswordSchema>;

export function useUpdatePassword() {
  const [messageUpdated, setMessageUpdated] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<PasswordPayload>({
    resolver: yupResolver(PasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", re_password: "" },
  });

  const { mutate: mutateUpdate, isPending } = useMutation({
    mutationFn: (payload: string) =>
      userService.updatePassword({ password: payload }),
    onSuccess: (res) => {
      reset();

      console.log("object", res);

      setMessageUpdated("Password updated successfully");

      setTimeout(() => {
        setMessageUpdated(null);
      }, 3000);
    },
    onError: (err: any) => {
      setError("root", { message: extractErrorMessage(err) });
      setMessageUpdated(null);
    },
  });

  const onSubmit = handleSubmit((payload) => mutateUpdate(payload.password));

  return {
    control,
    onSubmit,
    errors,
    isPending,
    isDirty,
    isValid,
    messageUpdated,
    setMessageUpdated,
  };
}
