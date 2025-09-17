// src/components/modals/SignupModal.tsx
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
} from "@heroui/react";

import React from "react";

import { MailIcon } from "@/components/icons/MailIcon";
import { LockIcon } from "@/components/icons/LockIcon";

type SignupModalProps = {
  isOpen: ModalProps["isOpen"];
  onOpenChange: ModalProps["onOpenChange"];
  onClose: () => void;
  step: number;
  formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function SignupModal({
  isOpen,
  onOpenChange,
  onClose,
  step,
  formData,
  handleChange,
  nextStep,
  prevStep,
  handleSubmit,
}: SignupModalProps) {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const phoneRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  // validasi per-step
  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 3:
        return formData.phone.trim().length >= 10;
      case 4:
        return (
          formData.password.trim().length >= 6 &&
          formData.password === formData.confirmPassword
        );
      default:
        return false;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      backdrop="blur"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="mx-6 my-8">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Sign up
              <span className="text-default-400 text-sm font-normal">
                Step {step} of 4
              </span>
            </ModalHeader>

            <ModalBody>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {step === 1 && (
                  <Input
                    ref={nameRef}
                    isRequired
                    variant="underlined"
                    label="Name"
                    name="name"
                    placeholder="Enter your name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                  />
                )}

                {step === 2 && (
                  <Input
                    ref={emailRef}
                    isRequired
                    variant="underlined"
                    endContent={
                      <MailIcon className="text-default-400 pointer-events-none shrink-0 text-2xl" />
                    }
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                )}

                {step === 3 && (
                  <Input
                    ref={phoneRef}
                    isRequired
                    variant="underlined"
                    label="Phone number"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="6281202020200"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                )}

                {step === 4 && (
                  <>
                    <Input
                      ref={passwordRef}
                      isRequired
                      variant="underlined"
                      endContent={
                        <LockIcon className="text-default-400 pointer-events-none shrink-0 text-2xl" />
                      }
                      label="Password"
                      name="password"
                      placeholder="Enter your password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    <Input
                      ref={confirmPasswordRef}
                      isRequired
                      variant="underlined"
                      label="Confirm password"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={
                        formData.confirmPassword.length > 0 &&
                        formData.password !== formData.confirmPassword
                      }
                      errorMessage={
                        formData.confirmPassword.length > 0 &&
                        formData.password !== formData.confirmPassword
                          ? "Passwords do not match"
                          : undefined
                      }
                    />
                  </>
                )}

                <div className="flex justify-end px-1 py-2">
                  <Link color="primary" href="/auth?tab=login" size="sm">
                    Already have an account?
                  </Link>
                </div>

                <ModalFooter className="px-0">
                  {step > 1 && (
                    <Button variant="flat" onPress={prevStep}>
                      Back
                    </Button>
                  )}

                  {step < 4 ? (
                    <Button
                      color="primary"
                      onPress={nextStep}
                      isDisabled={!isStepValid()}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      type="submit"
                      isDisabled={!isStepValid()}
                    >
                      Sign up
                    </Button>
                  )}

                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
