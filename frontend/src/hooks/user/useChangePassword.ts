import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { extractErrorMessage } from "@/utils/error";

const PasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Min 8 chars")
    .matches(/[A-Za-z]/, "Must contain letters")
    .matches(/[0-9]/, "Must contain numbers"),
});

type PasswordPayload = yup.InferType<typeof PasswordSchema>;

export function useChangePassword() {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<PasswordPayload>({
    resolver: yupResolver(PasswordSchema),
    mode: "onChange",
    defaultValues: { password: "" },
  });

  const { mutate: mutateChange, isPending } = useMutation({
    mutationFn: (payload: PasswordPayload) =>
      userService.updatePassword(payload),
    onSuccess: () => {
      reset();
    },
    onError: (err: any) => {
      setError("root", { message: extractErrorMessage(err) });
    },
  });

  const onSubmit = handleSubmit((payload) => mutateChange(payload));

  return { control, onSubmit, errors, isPending, isDirty, isValid };
}
