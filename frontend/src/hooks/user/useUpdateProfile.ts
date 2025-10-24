import { useForm, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { extractErrorMessage } from "@/utils/error";
import { useEffect, useState } from "react";

const ProfileSchema = yup.object({
  name: yup.string().trim().required("Name is required").min(2, "Min 2 chars"),
});

type ProfilePayload = yup.InferType<typeof ProfileSchema>;

export function useUpdateProfile({ name }: { name: string }) {
  const [messageUpdated, setMessageUpdated] = useState<string | null>(null);

  const qc = useQueryClient();

  const methods = useForm<ProfilePayload>({
    resolver: yupResolver(ProfileSchema),
    mode: "onChange",
    defaultValues: { name },
  });

  const { control, handleSubmit, setError, reset } = methods;

  const { errors, isDirty, isValid } = useFormState({
    control: methods.control,
  });

  useEffect(() => {
    if (typeof name !== "undefined") {
      reset({ name: name ?? "" });
    }
  }, [name, reset]);

  const { mutate: mutateUpdate, isPending } = useMutation({
    mutationFn: (payload: ProfilePayload) => userService.updateUser(payload),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["profile"] });
    },

    onSuccess: async (res, variables) => {
      const newName = res?.data?.name ?? variables?.name ?? "";

      qc.setQueryData(["profile"], (old: any) =>
        old ? { ...old, data: { ...old.data, name: newName } } : old,
      );

      reset({ name: newName });

      const msg =
        (res as any)?.message ??
        (res as any)?.data?.message ??
        "Updated successfully";

      setMessageUpdated(msg);

      setTimeout(() => {
        setMessageUpdated(null);
      }, 3000);
    },

    onError: (err: any) => {
      setError("root", { message: extractErrorMessage(err) });
      setMessageUpdated(null);
    },
  });

  const onSubmit = handleSubmit((payload) => mutateUpdate(payload));

  return {
    control,
    onSubmit,
    errors,
    isPending,
    isDirty,
    isValid,
    reset,
    messageUpdated: messageUpdated as string | null,
    setMessageUpdated,
  };
}
