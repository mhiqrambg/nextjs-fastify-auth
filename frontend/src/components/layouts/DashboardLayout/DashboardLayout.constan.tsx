import {
  LayoutGrid,
  Settings,
  UserRoundCog,
  NotebookPen,
  Users,
  GraduationCap,
  Book,
  School,
} from "lucide-react";

const SIDEBAR_ADMIN = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutGrid />,
  },
  {
    key: "student",
    label: "Student",
    href: "/admin/student",
    icon: <Users />,
  },
  {
    key: "teacher",
    label: "Teacher",
    href: "/admin/teacher",
    icon: <GraduationCap />,
  },
];

const SIDEBAR_USER = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard/user",
    icon: <LayoutGrid />,
  },
  {
    key: "Class Room",
    label: "Class Room",
    href: "/dashboard/user/class-room",
    icon: <School />,
  },
  {
    key: "My Exam",
    label: "My Exam",
    href: "/dashboard/user/exams",
    icon: <NotebookPen />,
  },
  {
    key: "profile",
    label: "Profile",
    href: "/dashboard/user/profile",
    icon: <UserRoundCog />,
  },
  {
    key: "settings",
    label: "Settings",
    href: "/dashboard/user/settings",
    icon: <Settings />,
  },
];

const SIDEBAR_STUDENT = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard/student",
    icon: <LayoutGrid />,
  },
  {
    key: "profile",
    label: "Profile",
    href: "/dashboard/student/profile",
    icon: <UserRoundCog />,
  },
  {
    key: "settings",
    label: "Settings",
    href: "/student/settings",
    icon: <Settings />,
  },
];

const SIDEBAR_TEACHER = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard/teacher",
    icon: <LayoutGrid />,
  },
  {
    key: "Class Room",
    label: "Class Room",
    href: "/dashboard/teacher/class-room",
    icon: <School />,
  },
  {
    key: "My Exams",
    label: "My Exams",
    href: "/dashboard/teacher/exams",
    icon: <NotebookPen />,
  },
  {
    key: "profile",
    label: "Profile",
    href: "/dashboard/teacher/profile",
    icon: <GraduationCap />,
  },
  {
    key: "settings",
    label: "Settings",
    href: "/dashboard/teacher/settings",
    icon: <Settings />,
  },
];

export { SIDEBAR_ADMIN, SIDEBAR_STUDENT, SIDEBAR_TEACHER, SIDEBAR_USER };
