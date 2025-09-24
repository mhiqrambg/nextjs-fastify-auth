// src/components/layouts/Sidebar/Sidebar.tsx
import React from "react";
import { Card, Button } from "@heroui/react";
import {
  HomeIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  VerifiedIcon,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import Image from "next/image";

import { useSession } from "next-auth/react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Toggle untuk mobile */}
      <Button
        isIconOnly
        variant="light"
        className="fixed top-4 left-4 z-50 md:hidden"
        onPress={() => setIsOpen(!isOpen)}
      >
        <MenuIcon />
      </Button>

      <Card
        className={`fixed top-0 left-0 z-40 h-screen w-64 rounded-none border-r bg-gray-50 shadow-lg transition-transform md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex w-full flex-row gap-2 bg-white p-4">
              <Image
                src="https://cdn.prod.website-files.com/636b968ac38dd1495ec4edcd/63c97bbbdeecd68494958b5d_manga-character_AI%20Avatar%20Dyvo.webp"
                alt="Profile"
                width={50}
                height={50}
                className="h-12 w-12 rounded-full"
              />

              <div>
                <div>Muh. Iqram Bahring</div>
                <div className="flex flex-row gap-1">
                  <VerifiedIcon color="green" size={20} />
                  Verified
                </div>
              </div>
            </div>
            <div className="px-4">
              <div className="flex flex-col">
                <SidebarItem
                  href="/user/dashboard"
                  icon={<HomeIcon size={20} />}
                  label="Dashboard"
                />
                <SidebarItem
                  href="/user/profile"
                  icon={<UserIcon size={20} />}
                  label="Profile"
                />
                <SidebarItem
                  href="/user/settings"
                  icon={<SettingsIcon size={20} />}
                  label="Settings"
                />
              </div>
            </div>
          </div>
          <div className="p-4">
            <button className="flex w-full items-center gap-2 rounded-md p-2 text-red-600 hover:bg-red-100">
              <LogOutIcon className="size-4" />
              Logout
            </button>
          </div>
        </nav>
      </Card>
    </>
  );
}
