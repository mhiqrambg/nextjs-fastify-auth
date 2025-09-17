// src/hooks/useLogin.tsx
import { useDisclosure } from "@heroui/react";

export function useLogin() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return {
    isOpen,
    onOpen,
    onOpenChange,
    onClose,
  };
}
