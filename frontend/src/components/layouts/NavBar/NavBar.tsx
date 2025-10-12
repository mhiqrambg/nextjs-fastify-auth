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
  Link as UiLink,
  cn,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Spinner,
} from "@heroui/react";
import NextLink from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

import SigninModal from "@/components/views/auth/SigninModal";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import ResetPasswordModal from "@/components/views/auth/ResetPasswordModal";

// Gunakan tipe minimal agar fleksibel terhadap payload sesi
type UserMinimal = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

// Helper untuk flatten user jika backend kirim { message, data, accessToken }
function useFlattenUser(session: any): UserMinimal | undefined {
  const rawUser = session?.user;
  if (!rawUser) return undefined;
  return (rawUser as any)?.data ? (rawUser as any).data : rawUser;
}

export default function App({
  className = "",
  position = "sticky",
}: {
  className?: string;
  position?: "static" | "sticky";
}) {
  const { data: session, status } = useSession();

  // Pastikan user flat
  const user = useFlattenUser(session);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    onOpen: onOpenReset,
    onOpenChange: onOpenChangeReset,
    isOpen: isOpenReset,
    onClose: onCloseReset,
  } = useResetPassword();

  const menuItems = [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Integrations", href: "#" },
  ];

  // Fallback role untuk path dashboard
  const role = (user?.role ?? "user").toString().toLowerCase();

  return (
    <Navbar
      position={position}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      className={cn(className)}
    >
      {/* Toggle Mobile */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* Brand Mobile */}
      <NavbarContent className="pr-3 sm:hidden" justify="center">
        <NavbarBrand>
          <NextLink href="/" aria-label="Quizolah Home">
            <Image src="/logo.png" alt="Quizolah" width={100} height={100} />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Menu Desktop */}
      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarBrand>
          <NextLink href="/" aria-label="Quizolah Home">
            <Image src="/logo.png" alt="Quizolah" width={100} height={100} />
          </NextLink>
        </NavbarBrand>

        {menuItems.map((item) => (
          <NavbarItem key={item.name} className="px-2">
            <UiLink as={NextLink} color="foreground" href={item.href}>
              {item.name}
            </UiLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right Section */}
      <NavbarContent justify="end">
        {status === "loading" && (
          <span className="text-default-500 flex items-center gap-2 text-sm">
            <Spinner size="sm" /> Memuat sesi…
          </span>
        )}

        {status === "unauthenticated" && (
          <>
            <NavbarItem className="hidden lg:flex">
              <UiLink as={NextLink} color="foreground" href="/auth/signup">
                Sign up
              </UiLink>
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
          </>
        )}

        {status === "authenticated" && user && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={user.name ?? user.email ?? "U"}
                size="sm"
                src={user.image ?? undefined}
              />
            </DropdownTrigger>

            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" isReadOnly>
                <p className="text-default-500 text-xs">Masuk sebagai</p>
                <p className="font-semibold">{user.name}</p>
              </DropdownItem>

              <DropdownItem key="dashboard">
                <NextLink href="/dashboard" className="block w-full">
                  {role} Dashboard
                </NextLink>
              </DropdownItem>

              <DropdownItem
                key="logout"
                color="danger"
                onPress={() => signOut({ callbackUrl: "/" })}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>

      {/* Menu Mobile */}
      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <UiLink
              as={NextLink}
              className="w-full"
              color="foreground"
              href={item.href}
              size="lg"
            >
              {item.name}
            </UiLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      {/* Modals */}
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
