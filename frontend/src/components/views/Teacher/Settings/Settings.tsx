import { useEffect, useMemo, useRef, useState } from "react";
import { useProfile } from "@/hooks/user/useProfile";
import { Button, Spinner, Alert, Avatar } from "@heroui/react";
import { Book, UserIcon, LockKeyhole } from "lucide-react";
import CustomTabs from "@/components/ui/CustomTabs";
import { ProfileForm } from "@/types/Profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import AccountTab from "./AccountTab";
import SecurityTab from "./SecurityTab";
import MyClassTab from "./MyClassTab";

function deriveLevel(userId?: string) {
  const levels = [
    "rookie",
    "beginner",
    "intermediate",
    "advanced",
    "expert",
  ] as const;
  if (!userId) return levels[0];
  let sum = 0;
  for (let i = 0; i < userId.length; i++)
    sum = (sum + userId.charCodeAt(i)) % 997;
  return levels[sum % levels.length];
}

const SettingsView = () => {
  const router = useRouter();
  const { status } = useSession();
  const { data, isLoading, isError, error, refetch, isFetching } = useProfile();
  const user = data?.data;

  const [formUser, setFormUser] = useState<ProfileForm>({
    id: "",
    name: "",
    email: "",
    password: "",
    re_password: "",
    phone_number: "",
    phone_verified_at: null,
    email_verified_at: null,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const lastSyncedFingerprint = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fingerprint = JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      phone_verified_at: user.phone_verified_at,
      email_verified_at: user.email_verified_at,
    });

    if (lastSyncedFingerprint.current === fingerprint) return;
    lastSyncedFingerprint.current = fingerprint;

    setFormUser({
      id: user.id ?? "",
      name: user.name ?? "",
      email: user.email ?? "",
      password: "",
      re_password: "",
      phone_number: user.phone_number ?? "",
      phone_verified_at: user.phone_verified_at ?? null,
      email_verified_at: user.email_verified_at ?? null,
    });
  }, [user]);

  const level = useMemo(() => deriveLevel(user?.id), [user?.id]);

  const tabs = useMemo(
    () => [
      {
        key: "accountInfo",
        title: "Account",
        icon: <UserIcon />,
        content: <AccountTab formUser={formUser} isFetching={isFetching} />,
      },
      {
        key: "securityInfo",
        title: "Passwords and security",
        icon: <LockKeyhole />,
        content: <SecurityTab isFetching={isFetching} />,
      },
      {
        key: "myClassInfo",
        title: "My Class",
        icon: <Book />,
        content: <MyClassTab isFetching={isFetching} />,
      },
    ],
    [formUser, isFetching],
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center gap-2">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    const errorStatus = (error as any)?.response?.status;
    const message =
      (error as any)?.response?.data?.message ||
      (error as Error)?.message ||
      "An error occurred while loading the data.";

    if (errorStatus === 401) {
      return (
        <div className="max-w-xl">
          <Alert color="danger" variant="flat" title="Session Expired">
            Your session has expired. Please log in again.
          </Alert>
          <div className="mt-3">
            <Button
              color="primary"
              onPress={() => router.push("/auth/signin")}
              variant="solid"
            >
              Go to Login
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-xl">
        <Alert color="danger" variant="flat" title="Failed to load profile">
          {message}
        </Alert>
        <div className="mt-3">
          <Button onPress={() => refetch()} variant="flat">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-center gap-4 p-4">
        <Avatar
          src={user?.profile_image || "/images/user/user.svg"}
          className="text-large h-24 w-24"
        />
        <div className="flex flex-col items-start justify-center gap-2">
          <p className="text-xl font-semibold capitalize">
            {user?.name || "User"}
          </p>
          <p className="text-foreground/60 text-sm">{user?.email}</p>
          <p className="rounded-full bg-[#14A7A0] px-2 py-1 text-sm text-white uppercase">
            {level}
          </p>
        </div>
      </div>
      <CustomTabs tabs={tabs} />
    </div>
  );
};

export default SettingsView;
