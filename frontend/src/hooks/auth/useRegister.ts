// libraries
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import useUserStore from "@/store/useUserStore";

// services
import { ISignup } from "@/types/Auth";

const RegisterSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(4, "Name must be at least 4 characters long.")
    .max(60, "Name must be at most 60 characters long."),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup
    .string()
    .matches(/^[0-9]+$/, "Phone must contain only numbers")
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must be at most 15 digits")
    .required("Phone is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{5,}$/,
      "Password must contain",
    )
    .required("Password is required"),

  re_password: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export function useRegister() {
  const { setUser } = useUserStore();
  const passwordRules = [
    {
      label: "Lowercase letter",
      test: (value: string) => /[a-z]/.test(value),
    },
    {
      label: "Uppercase letter",
      test: (value: string) => /[A-Z]/.test(value),
    },
    {
      label: "Special character",
      test: (value: string) => /[^A-Za-z0-9]/.test(value),
    },
    {
      label: "Min 5 characters long",
      test: (value: string) => value.length >= 5,
    },
  ];

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      password: "",
      re_password: "",
    },
  });

  const passwordValue = watch("password", "");

  const registerService = async (payload: ISignup) => {
    const res = await authService.signup(payload);
    return res;
  };

  const { mutate: mutateRegister, isPending: isPendingRegister } = useMutation({
    mutationFn: registerService,
    onSuccess: () => {
      reset();
    },
    onError: (err: any) => {
      console.log("error", err);
      const message =
        err?.response?.data?.details[0]?.message ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";

      setError("root", { message });
    },
  });

  const handleRegister = (
    data: ISignup,
    options?: { onSuccess?: (res: any) => void },
  ) =>
    mutateRegister(data, {
      onSuccess: (res) => {
        // console.log("res", res);
        setUser(res.data.data);
        options?.onSuccess?.(res);
      },
    });

  return {
    RegisterSchema,
    mutateRegister,
    isPendingRegister,
    handleRegister,
    control,
    errors,
    handleSubmit,
    passwordValue,
    passwordRules,
  };
}
