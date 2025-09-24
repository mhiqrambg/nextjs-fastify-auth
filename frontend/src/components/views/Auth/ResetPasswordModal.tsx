// src/components/views/Auth/ForgotPasswordModal.tsx
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  ModalProps,
  Form,
  Spinner,
  Link,
} from "@heroui/react";
import { Controller } from "react-hook-form";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { MailIcon } from "lucide-react";

type ForgotPasswordModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onOpenSignin: () => void;
  onClose: () => void;
};

export default function ResetPasswordModal({
  isOpen,
  onOpenChange,
  onOpenSignin,
  onClose,
}: ForgotPasswordModalProps) {
  const {
    handleResetPassword,
    isPendingResetPassword,
    control,
    errors,
    handleSubmit,
  } = useResetPassword();

  const handleBackToLogin = () => {
    onClose();

    setTimeout(() => {
      onOpenSignin();
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
        <Form id="forgot-form" onSubmit={handleSubmit(handleResetPassword)}>
          <ModalHeader className="flex flex-col gap-1">
            Forgot Password
          </ModalHeader>
          <ModalBody className="w-full">
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
                  endContent={
                    <MailIcon className="text-default-400 text-2xl" />
                  }
                />
              )}
            />
            <p className="text-default-500 mt-4 gap-2 px-1 text-sm">
              Enter your email to receive a reset password link.
              <br />
              have an account?
              <Link
                size="sm"
                className="hover:text-red-600"
                onPress={handleBackToLogin}
              >
                &nbsp;Login here
              </Link>
            </p>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button color="primary" type="submit" form="forgot-form">
              {isPendingResetPassword ? (
                <Spinner color="white" size="sm" />
              ) : (
                "Reset"
              )}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}
