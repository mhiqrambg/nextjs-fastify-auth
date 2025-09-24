// libraries
import React from "react";
import { useDisclosure } from "@heroui/react";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import useUserStore from "@/store/useUserStore";

const OtpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 characters"),
});

// types
import { IVerifyOtp } from "@/types/Auth";
type BackdropType = "opaque" | "blur" | "transparent";
type OtpFormData = yup.InferType<typeof OtpSchema>;

export default function useOtp() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState<BackdropType>("blur");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { user } = useUserStore();

  const {
    reset,
    setError,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(OtpSchema),
    mode: "onChange",
  });

  const otpService = async (payload: IVerifyOtp) => {
    const res = await authService.verifyOtp(payload);
    return res;
  };

  const { mutate: mutateOtp, isPending: isPendingOtp } = useMutation({
    mutationFn: otpService,
    onSuccess: (res) => {
      reset();
      console.log("res", res);
      setIsSuccess(true);
    },
    onError: (err: any) => {
      console.log("error", err);
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";
      setError("root", { message });
    },
  });

  const onOpenModal = (type: BackdropType = "blur") => {
    setBackdrop(type);
    onOpen();
  };

  const handleOtp = (data: OtpFormData) => {
    if (!user?.id || !user?.phone_number) {
      console.log("tidak ada user");
      setError("root", { message: "User data is missing. Please try again." });
      return;
    }

    console.log("user", user);

    mutateOtp({
      ...data,
      id: user?.id || "",
      phone_number: user?.phone_number || "",
    });
  };

  return {
    isOpen,
    onOpen,
    onClose,
    onOpenModal,
    onOpenChange,
    backdrop,
    handleOtp,
    control,
    errors,
    handleSubmit,
    isPendingOtp,
    isSuccess,
    setIsSuccess,
  };
}
