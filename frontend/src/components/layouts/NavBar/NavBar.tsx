import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  cn,
} from "@heroui/react";

import Image from "next/image";

import { useLogin } from "@/components/layouts/NavBar/useLogin";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { useSignup } from "./useSignup";

export default function App({
  className = "",
  position = "sticky",
}: {
  className?: string;
  position?: "static" | "sticky";
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { onOpen, isOpen, onOpenChange } = useLogin();
  const signup = useSignup();

  // satukan menu utama
  const menuItems = [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#", active: true },
    { name: "Integrations", href: "#" },
  ];

  return (
    <Navbar
      position={position}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      className={cn(className)}
    >
      {/* Toggle untuk mobile */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* Brand di mobile */}
      <NavbarContent className="pr-3 sm:hidden" justify="center">
        <NavbarBrand>
          <Link href="/">
            <Image src="/logo.webp" alt="Quizolah" width={100} height={100} />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Menu utama di desktop */}
      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarBrand>
          <Link href="/">
            <Image src="/logo.webp" alt="Quizolah" width={100} height={100} />
          </Link>
        </NavbarBrand>
        {menuItems.map((item) => (
          <NavbarItem key={item.name} isActive={item.active} className="px-2">
            <Link
              color={item.active ? "warning" : "foreground"}
              href={item.href}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Login/Signup */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link color="foreground" onPress={signup.onOpen}>
            Sign up
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            className="bg-quiz-navy text-white shadow-lg"
            radius="full"
            onPress={onOpen}
          >
            Log in
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Menu di mobile */}
      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <Link
              className="w-full"
              color={item.active ? "warning" : "foreground"}
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
      <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <SignupModal
        isOpen={signup.isOpen}
        onOpenChange={signup.onOpenChange}
        onClose={signup.onClose}
        step={signup.step}
        formData={signup.formData}
        handleChange={signup.handleChange}
        nextStep={signup.nextStep}
        prevStep={signup.prevStep}
        handleSubmit={signup.handleSubmit}
      />
    </Navbar>
  );
}
