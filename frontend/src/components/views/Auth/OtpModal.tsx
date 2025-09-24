import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalProps,
  InputOtp,
} from "@heroui/react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import router from "next/router";
import OtpCountdown from "@/components/ui/OtpCountdown";

type OtpModalProps = {
  isOpen: ModalProps["isOpen"];
  onClose: ModalProps["onClose"];
  backdrop: ModalProps["backdrop"];
  onOpenChange: ModalProps["onOpenChange"];
  handleSubmit: UseFormHandleSubmit<any>;
  handleOtp: (data: any) => void;
  control: Control<any>;
  errors: FieldErrors<any>;
  isSuccess: boolean;
};

export default function OtpModal({
  isOpen,
  onClose,
  backdrop,
  onOpenChange,
  handleSubmit,
  handleOtp,
  control,
  errors,
  isSuccess,
}: OtpModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const handleClose = () => {
    if (showConfirmation) {
      onClose?.();
    } else {
      setShowConfirmation(true);
    }
  };

  const handleConfirmClose = () => {
    onClose?.();
    setShowConfirmation(false);
  };

  const handleCancelClose = () => {
    setShowConfirmation(false);
  };

  const handleExpireOtp = () => {
    setIsExpired(true);
  };

  const handleResendOtp = () => {
    console.log("Resend OTP");
  };

  return (
    <div>
      <Modal
        backdrop={backdrop}
        isOpen={isOpen}
        onClose={handleClose}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="md:w-1/3">
          <form
            className="flex w-full flex-col"
            onSubmit={handleSubmit(handleOtp)}
          >
            <ModalHeader>
              {isSuccess ? "Register Success" : "Verify OTP"}
            </ModalHeader>
            <ModalBody>
              {isSuccess ? (
                <p className="text-default-500 text-sm">
                  OTP verified successfully. <br />
                  You can now go to home and login to your account.
                  <br />
                </p>
              ) : (
                <div>
                  <p className="text-default-500 text-sm">
                    We have sent a verification code to your{" "}
                    <span className="font-bold text-black">
                      whatsapp phone number
                    </span>
                    .Please enter the code below to verify your account.
                  </p>

                  <div className="flex w-full flex-wrap items-center justify-center gap-4 md:flex-nowrap">
                    <Controller
                      control={control}
                      name="otp"
                      render={({ field }) => (
                        <InputOtp
                          {...field}
                          isInvalid={!!errors.otp}
                          errorMessage={errors.otp?.message as string}
                          length={6}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    {isExpired ? (
                      <Button
                        onPress={handleResendOtp}
                        variant="light"
                        color="danger"
                        size="sm"
                      >
                        Resend OTP
                      </Button>
                    ) : (
                      <OtpCountdown
                        initialSeconds={10}
                        onExpire={handleExpireOtp}
                      />
                    )}
                  </div>
                  <p className="w-full px-2 text-center text-[12px] text-red-400">
                    {errors?.root?.message}
                  </p>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="flex items-start justify-center bg-gray-100">
              {showConfirmation ? (
                <>
                  <Button
                    className="max-w-fit"
                    type="submit"
                    variant="flat"
                    size="sm"
                    color="danger"
                    onPress={handleConfirmClose}
                  >
                    Yes, Close
                  </Button>
                  <Button variant="light" size="sm" onPress={handleCancelClose}>
                    No, Stay
                  </Button>
                </>
              ) : isSuccess ? (
                <Button
                  className="max-w-fit"
                  type="button"
                  onPress={() => {
                    onClose?.();
                    router.push("/");
                  }}
                  variant="flat"
                  size="sm"
                  color="primary"
                >
                  Go to Home
                </Button>
              ) : (
                <Button
                  className="max-w-fit"
                  type="submit"
                  variant="flat"
                  size="sm"
                  color="primary"
                >
                  Verify OTP
                </Button>
              )}
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
