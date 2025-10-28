import { Button, Listbox, ListboxItem, Spinner, Tooltip } from "@heroui/react";
import { ArrowLeftToLine, ChevronsLeft, ChevronsRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { cn } from "@/utils/cn";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { isActivePath } from "@/utils/isActivePath";

interface SidebarItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface PropsTypes {
  sidebarItems: SidebarItem[];
  isOpen: boolean;
}

const COLLAPSE_STORAGE_KEY = "dashboardSidebarCollapsed";

const DashboardLayoutSidebar = ({ sidebarItems, isOpen }: PropsTypes) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // (opsional) persist preferensi collapse
  useEffect(() => {
    const raw =
      typeof window !== "undefined" &&
      localStorage.getItem(COLLAPSE_STORAGE_KEY);
    if (raw) setIsCollapsed(raw === "1");
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(COLLAPSE_STORAGE_KEY, isCollapsed ? "1" : "0");
    }
  }, [isCollapsed]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/auth/signin", redirect: true });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className={cn(
        "border-default-200 fixed z-50 flex h-screen w-full -translate-x-full flex-col justify-between border-r-1 bg-white transition-all lg:relative lg:translate-x-0",
        isCollapsed ? "max-w-[72px] p-2" : "max-w-[250px] p-4",
        { "translate-x-0": isOpen },
      )}
    >
      <div>
        <div className={cn("mb-4 flex w-full items-center", "justify-center")}>
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-start",
            )}
            onClick={() => router.push("/")}
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={isCollapsed ? 36 : 180}
              height={isCollapsed ? 36 : 60}
              className={cn(
                "cursor-pointer",
                isCollapsed ? "mt-12 w-9" : "w-32",
              )}
              priority
            />
          </div>
        </div>

        {/* Jika collapsed, tampilkan toggle kecil di bawah logo */}

        <Listbox
          items={sidebarItems}
          variant="solid"
          aria-label="Dashboard Menu"
        >
          {(item) => {
            const active = isActivePath(router.asPath, item.href);

            const itemNode = (
              <ListboxItem
                key={item.key}
                className={cn(
                  "my-1 h-12",
                  isCollapsed ? "justify-center px-0" : "px-3 text-2xl",
                  { "bg-quiz-navy/90 text-white": active },
                )}
                classNames={{
                  title: cn("truncate", isCollapsed && "hidden"),
                }}
                startContent={
                  <span className="grid w-10 place-items-center">
                    {item.icon}
                  </span>
                }
                textValue={item.label}
                aria-label={item.label}
                onPress={() => router.push(item.href)}
              >
                {item.label}
              </ListboxItem>
            );

            return isCollapsed ? (
              <Tooltip key={item.key} content={item.label} placement="right">
                {itemNode}
              </Tooltip>
            ) : (
              itemNode
            );
          }}
        </Listbox>
      </div>

      <div
        className={cn("p1 flex items-center", isCollapsed && "justify-center")}
      >
        <button
          type="button"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setIsCollapsed((v) => !v)}
          className={cn(
            "hidden lg:flex",
            "absolute top-1/2 right-[-12px] -translate-y-1/2",
            "h-8 w-8 items-center justify-center rounded-full",
            "border-default-200 border bg-white shadow-md",
            "hover:bg-default-100 z-50 transition-colors",
          )}
        >
          {isCollapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DashboardLayoutSidebar;
