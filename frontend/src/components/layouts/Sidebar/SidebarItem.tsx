import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/utils/cn";

interface SidebarItemProps {
  href: string;
  icon?: React.ReactNode;
  label: string;
}

export default function SidebarItem({
  href,
  icon: Icon,
  label,
}: SidebarItemProps) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md p-2 transition-colors",
        isActive
          ? "text-default-900 bg-gray-700"
          : "text-gray-700 hover:bg-gray-100 hover:text-black",
      )}
    >
      {Icon && <span className="size-5">{Icon}</span>}
      <span className="text-sm">{label}</span>
    </Link>
  );
}
