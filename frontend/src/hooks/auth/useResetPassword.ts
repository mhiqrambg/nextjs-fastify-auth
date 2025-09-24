import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// type
import { IResetPassword } from "@/types/Auth";
import { authService } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useDisclosure } from "@heroui/react";

const ResetPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export function useResetPassword() {
  const { onOpen, onOpenChange, onClose, isOpen } = useDisclosure();
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const resetPasswordService = async (payload: IResetPassword) => {
    const res = await authService.resetPassword(payload);
    return res;
  };

  const { mutate: mutateResetPassword, isPending: isPendingResetPassword } =
    useMutation({
      mutationFn: resetPasswordService,
      onSuccess: () => {
        reset();
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message || err.message || "Something went wrong";
        setError("root", { message });
      },
    });

  const handleResetPassword = (data: IResetPassword) =>
    mutateResetPassword(data);

  return {
    control,
    handleSubmit,
    setError,
    reset,
    errors,
    handleResetPassword,
    isPendingResetPassword,
    onOpen,
    onOpenChange,
    onClose,
    isOpen,
  };
}
