import { Button, Listbox, ListboxItem } from "@heroui/react";
import { ArrowLeftToLine } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { cn } from "@/utils/cn";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

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

const DashboardLayoutSidebar = (props: PropsTypes) => {
  const { sidebarItems, isOpen } = props;
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        callbackUrl: "/auth/signin",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };
  return (
    <div
      className={cn(
        "border-default-200 fixed z-50 flex h-screen w-full max-w-[250px] -translate-x-full flex-col justify-between border-r-1 bg-white p-4 transition-all lg:relative lg:translate-x-0",
        { "translate-x-0": isOpen },
      )}
    >
      <div>
        <div className="flex w-full justify-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={180}
            height={60}
            className="mb-6 w-32"
            onClick={() => router.push("/")}
          />
        </div>
        <Listbox
          items={sidebarItems}
          variant="solid"
          aria-label="Dashboard Menu"
        >
          {(item) => (
            <ListboxItem
              key={item.key}
              className={cn("my-1 h-12 text-2xl", {
                "bg-quiz-navy/90 text-white": router.pathname.startsWith(
                  item.href,
                ),
              })}
              startContent={item.icon}
              textValue={item.label}
              aria-labelledby={item.label}
              aria-describedby={item.label}
              as={Link as any}
              href={item.href}
            >
              <p>{item.label}</p>
            </ListboxItem>
          )}
        </Listbox>
      </div>
      <div className="p1 flex items-center">
        <Button
          color="danger"
          fullWidth
          variant="light"
          className="flex justify-start rounded-lg px-2 py-1.5"
          size="lg"
          onPress={handleLogout}
          isLoading={isLoggingOut}
          disabled={isLoggingOut}
        >
          <ArrowLeftToLine size={18} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default DashboardLayoutSidebar;
