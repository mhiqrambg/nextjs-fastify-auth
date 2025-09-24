// Libraries
import React from "react";
import { motion } from "framer-motion";
import { Controller } from "react-hook-form";
import { Form, Input, Button, Card, Skeleton, Spinner } from "@heroui/react";

// types
import { ISignup } from "@/types/Auth";

// hooks
import { useRegister } from "@/hooks/auth/useRegister";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import useOtp from "@/hooks/auth/useOtp";

// components
import OtpModal from "@/components/views/auth/OtpModal";

// icons
import {
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  XIcon,
  Link,
  InfoIcon,
} from "lucide-react";

const Register = () => {
  const { visibility, toggleVisibility } = usePasswordVisibility([
    "password",
    "re_password",
  ]);

  const {
    isOpen,
    onClose,
    backdrop,
    onOpenModal,
    onOpenChange,
    handleOtp,
    control: controlOtp,
    errors: errorsOtp,
    handleSubmit: handleSubmitOtp,
    isSuccess,
  } = useOtp();
  const {
    handleRegister,
    control,
    errors,
    isPendingRegister,
    handleSubmit: handleSubmitRegister,
    passwordValue,
    passwordRules,
  } = useRegister();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOpenInfo, setIsOpenInfo] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(t);
  }, []);

  const handleFormSubmit = (data: ISignup) => {
    handleRegister(data, {
      onSuccess: () => {
        setTimeout(() => {
          onOpenModal("blur");
        }, 500);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full md:w-2/5"
      >
        <Card className="w-full rounded-xl p-10 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-4">
            <div className="justify-center text-center">
              <Skeleton
                isLoaded={!isLoading}
                className="mx-auto rounded-lg md:w-2/3"
              >
                <h2 className="text-quiz-navy text-2xl font-semibold">
                  Create an account
                </h2>
                <p className="text-sm text-gray-500">
                  Join us today and start managing your contracts easily
                </p>
              </Skeleton>
            </div>

            <Skeleton
              isLoaded={!isLoading}
              className="h-[2px] w-full rounded-lg bg-gray-200"
            >
              <div className="border-b-2 border-gray-200"></div>
            </Skeleton>

            {errors.root && (
              <div className="mb-2 w-full rounded-lg bg-red-50 p-2 text-center text-red-500">
                {errors.root?.message}
              </div>
            )}

            <Form onSubmit={handleSubmitRegister(handleFormSubmit)}>
              <Skeleton
                isLoaded={!isLoading}
                className="mb-2 w-full rounded-lg"
              >
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Name"
                      placeholder="Enter your name"
                      variant="bordered"
                      type="text"
                      autoComplete="off"
                      isInvalid={!!errors.name}
                      errorMessage={errors.name?.message}
                    />
                  )}
                />
              </Skeleton>
              <Skeleton
                isLoaded={!isLoading}
                className="mb-2 w-full rounded-lg"
              >
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Email"
                      placeholder="Enter your email"
                      variant="bordered"
                      type="email"
                      autoComplete="off"
                      isInvalid={!!errors.email}
                      errorMessage={errors.email?.message}
                    />
                  )}
                />
              </Skeleton>
              <Skeleton
                isLoaded={!isLoading}
                className="mb-2 w-full rounded-lg"
              >
                <Controller
                  control={control}
                  name="phone_number"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Phone"
                      placeholder="Enter your phone"
                      variant="bordered"
                      type="tel"
                      autoComplete="off"
                      isInvalid={!!errors.phone_number}
                      errorMessage={errors.phone_number?.message}
                      endContent={
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => {
                            setIsOpenInfo(!isOpenInfo);
                          }}
                        >
                          <InfoIcon className="size-5 text-gray-400" />
                        </Button>
                      }
                    />
                  )}
                />
              </Skeleton>

              {isOpenInfo && (
                <p className="text-default-500 px-1 text-sm">
                  We will send you a verification code to your phone number
                </p>
              )}

              <Skeleton
                isLoaded={!isLoading}
                className="mb-2 w-full rounded-lg"
              >
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Password"
                      type={visibility.password ? "text" : "password"}
                      placeholder="Enter your password"
                      variant="bordered"
                      autoComplete="off"
                      isInvalid={!!errors.password}
                      errorMessage={errors.password?.message}
                      endContent={
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => toggleVisibility("password")}
                        >
                          {visibility.password ? (
                            <EyeIcon className="size-5" />
                          ) : (
                            <EyeOffIcon className="text-default-400 pointer-events-none size-5 shrink-0" />
                          )}
                        </Button>
                      }
                    />
                  )}
                />

                {passwordValue && (
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                    {passwordRules.map((rule, idx) => {
                      const valid = rule.test(passwordValue);
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          {valid ? (
                            <CheckIcon className="size-4 text-green-600" />
                          ) : (
                            <XIcon className="size-4 text-red-600" />
                          )}
                          <span
                            className={
                              valid ? "text-green-600" : "text-red-600"
                            }
                          >
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Skeleton>
              <Skeleton
                isLoaded={!isLoading}
                className="mb-2 w-full rounded-lg"
              >
                <Controller
                  control={control}
                  name="re_password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Confirm Password"
                      type={visibility.re_password ? "text" : "password"}
                      placeholder="Enter your confirm password"
                      variant="bordered"
                      autoComplete="off"
                      isInvalid={!!errors.re_password}
                      errorMessage={errors.re_password?.message}
                      endContent={
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => toggleVisibility("re_password")}
                        >
                          {visibility.re_password ? (
                            <EyeIcon className="size-5" />
                          ) : (
                            <EyeOffIcon className="text-default-400 pointer-events-none size-5 shrink-0" />
                          )}
                        </Button>
                      }
                    />
                  )}
                />
              </Skeleton>

              <Skeleton
                isLoaded={!isLoading}
                className="w-full rounded-lg px-16"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="submit"
                    className="hover:bg-quiz-navy bg-quiz-navy w-full text-white"
                  >
                    {isPendingRegister ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Create an account"
                    )}
                  </Button>
                </motion.div>
              </Skeleton>
            </Form>
          </div>
        </Card>
      </motion.div>
      <OtpModal
        isOpen={isOpen}
        onClose={onClose}
        backdrop={backdrop}
        onOpenChange={onOpenChange}
        handleSubmit={handleSubmitOtp}
        handleOtp={handleOtp}
        control={controlOtp}
        errors={errorsOtp}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default Register;
