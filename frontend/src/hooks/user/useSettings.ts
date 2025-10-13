import { userService } from "@/services/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { extractErrorMessage } from "@/utils/error";

const SettingsSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  password: yup.string().required("Password is required"),
  re_password: yup.string().required("Confirm password is required"),
});

export function useSettings() {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SettingsSchema),
    mode: "onChange",
  });

  const updateUserService = async (payload: any) => {
    const res = await userService.updateUser(payload);
    return res;
  };

  const { mutate: mutateUpdateUser, isPending: isPendingUpdateUser } =
    useMutation({
      mutationFn: updateUserService,
      onSuccess: () => {
        reset();
      },
      onError: (err: any) => {
        const message = extractErrorMessage(err);
        setError("root", { message });
      },
    });

  const handleUpdateUser = (payload: any) => {
    mutateUpdateUser(payload);
  };

  return {
    control,
    handleSubmit,
    setError,
    reset,
    errors,
    handleUpdateUser,
    isPendingUpdateUser,
  };
}
