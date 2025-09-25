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
  useDisclosure,
} from "@heroui/react";

import Image from "next/image";

import SigninModal from "@/components/views/auth/SigninModal";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import ResetPasswordModal from "@/components/views/auth/ResetPasswordModal";

export default function App({
  className = "",
  position = "sticky",
}: {
  className?: string;
  position?: "static" | "sticky";
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    onOpen: onOpenReset,
    onOpenChange: onOpenChangeReset,
    isOpen: isOpenReset,
    onClose: onCloseReset,
  } = useResetPassword();

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
            <Image src="/logo.png" alt="Quizolah" width={100} height={100} />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Menu utama di desktop */}
      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarBrand>
          <Link href="/">
            <Image src="/logo.png" alt="Quizolah" width={100} height={100} />
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
          <Link color="foreground" href="/auth/signup">
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
      <SigninModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onOpenReset={onOpenReset}
        isClose={onClose}
      />
      <ResetPasswordModal
        isOpen={isOpenReset}
        onOpenChange={onOpenChangeReset}
        onOpenSignin={onOpen}
        onClose={onCloseReset}
      />
    </Navbar>
  );
}
