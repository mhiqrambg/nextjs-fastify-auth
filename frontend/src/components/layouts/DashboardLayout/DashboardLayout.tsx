import { useState } from "react";

import PageHead from "@/components/commons/PageHead";
import DashboardLayoutSidebar from "@/components/layouts/DashboardLayout/DashboardLayoutSidebar";
import {
  SIDEBAR_ADMIN,
  SIDEBAR_STUDENT,
  SIDEBAR_TEACHER,
  SIDEBAR_USER,
} from "./DashboardLayout.constan";
import { Navbar, NavbarMenuToggle } from "@heroui/react";

const DashboardLayout = (props: {
  children: React.ReactNode;
  title: string;
  type: "student" | "teacher" | "admin" | "user";
  isOpen: boolean;
}) => {
  const { children, title, type } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHead title={`Quizolah | ${title}`} />
      <div className="max-w-screen-3xl 3xl:container flex">
        <DashboardLayoutSidebar
          sidebarItems={
            type === "student"
              ? SIDEBAR_STUDENT
              : type === "teacher"
                ? SIDEBAR_TEACHER
                : type === "user"
                  ? SIDEBAR_USER
                  : SIDEBAR_ADMIN
          }
          isOpen={open}
        />
        <div className="h-screen w-full overflow-y-auto px-4">
          <Navbar
            className="flex justify-between bg-transparent px-0"
            isBlurred={false}
            position="static"
            classNames={{
              wrapper: "px-0",
            }}
          >
            <h1 className="text-2xl font-bold">{title}</h1>
            <NavbarMenuToggle
              aria-label={open ? "Close menu" : "Open menu"}
              className="lg:hidden"
              onClick={() => setOpen(!open)}
            >
              <p className="text-2xl font-bold">Menu</p>
            </NavbarMenuToggle>
          </Navbar>
          <div className="flex flex-col gap-6">{children}</div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
