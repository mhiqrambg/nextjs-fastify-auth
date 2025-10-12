import React from "react";
import { useSession, signOut } from "next-auth/react";

export function useUserAuth() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return { user, isMenuOpen, setIsMenuOpen, status, signOut };
}
