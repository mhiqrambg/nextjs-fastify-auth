// src/hooks/useSignup.tsx
import { useDisclosure } from "@heroui/react";
import React from "react";

export function useSignup() {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return {
    step,
    setStep,
    formData,
    setFormData,
    isOpen,
    onOpen,
    onOpenChange,
    onClose,
    nextStep,
    prevStep,
    handleChange,
    handleSubmit,
  };
}
