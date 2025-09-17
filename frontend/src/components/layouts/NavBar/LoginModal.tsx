// src/components/modals/LoginModal.tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Link,
  ModalProps,
} from "@heroui/react";

import { MailIcon } from "@/components/icons/MailIcon";
import { LockIcon } from "@/components/icons/LockIcon";

type LoginModalProps = {
  isOpen: ModalProps["isOpen"];
  onOpenChange: ModalProps["onOpenChange"];
};

export default function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      backdrop="blur"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="mx-6 my-8">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
            <ModalBody>
              <Input
                endContent={
                  <MailIcon className="text-default-400 pointer-events-none shrink-0 text-2xl" />
                }
                label="Email"
                placeholder="Enter your email"
                variant="underlined"
                className="text-base"
              />
              <Input
                endContent={
                  <LockIcon className="text-default-400 pointer-events-none shrink-0 text-2xl" />
                }
                label="Password"
                placeholder="Enter your password"
                type="password"
                variant="underlined"
                className="text-base"
              />
              <div className="flex justify-between px-1 py-2">
                <Link color="primary" href="/auth?tab=register" size="sm">
                  Create an account?
                </Link>
                <Link color="primary" href="/auth?tab=register" size="sm">
                  Forgot password?
                </Link>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Sign in
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
