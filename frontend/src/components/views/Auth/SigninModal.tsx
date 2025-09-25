// src/components/views/Auth/SigninModal.tsx
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Link,
  ModalProps,
  Form,
  Spinner,
} from "@heroui/react";

import { Controller } from "react-hook-form";
import { useLogin } from "@/hooks/auth/useLogin";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type SigninModalProps = {
  isOpen: ModalProps["isOpen"];
  onOpenChange: ModalProps["onOpenChange"];
  onOpenReset: () => void;
  isClose: () => void;
};

export default function SigninModal({
  isOpen,
  onOpenChange,
  onOpenReset,
  isClose,
}: SigninModalProps) {
  const { handleLogin, isPendingLogin, control, errors, handleSubmit } =
    useLogin();
  const { visibility, toggleVisibility } = usePasswordVisibility(["password"]);

  const handleOpenReset = () => {
    isClose();

    setTimeout(() => {
      onOpenReset();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      backdrop="blur"
    >
      <ModalContent className="mx-6 my-8">
        <Form id="login-form" onSubmit={handleSubmit(handleLogin)}>
          <ModalHeader className="flex flex-col gap-1">Sign In</ModalHeader>
          <ModalBody className="w-full">
            {errors.root && (
              <p className="text-red-500"> {errors.root?.message}</p>
            )}
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email"
                  placeholder="Enter your email"
                  variant="underlined"
                  className="text-base"
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Password"
                  placeholder="Enter your password"
                  type={visibility.password ? "text" : "password"}
                  variant="underlined"
                  className="text-base"
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  endContent={
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => toggleVisibility("password")}
                    >
                      {visibility.password ? (
                        <EyeIcon />
                      ) : (
                        <EyeOffIcon className="text-default-400 pointer-events-none shrink-0 text-2xl" />
                      )}
                    </Button>
                  }
                />
              )}
            />
            <div className="flex w-full justify-between px-1">
              <Link color="primary" href="/auth/signup" size="sm">
                Create an account?
              </Link>
              <Link color="primary" size="sm" onPress={handleOpenReset}>
                Forgot password?
              </Link>
            </div>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button color="primary" type="submit" form="login-form">
              {isPendingLogin ? <Spinner color="white" size="sm" /> : "Sign in"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}
