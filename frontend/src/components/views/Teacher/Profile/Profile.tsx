import { useMemo, useEffect } from "react";
import { useProfile } from "@/hooks/user/useProfile";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Spinner,
  Alert,
  Avatar,
} from "@heroui/react";
import {
  Image,
  FolderIcon,
  ShieldAlert,
  ShieldCheck,
  UserIcon,
} from "lucide-react";
import CustomTabs from "@/components/ui/CustomTabs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function formatDate(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

const ProfileView = () => {
  const router = useRouter();
  const { status } = useSession();
  const { data, isLoading, isError, error, refetch, isFetching } = useProfile();
  const user = data?.data;

  const levels = ["rookie", "beginner", "intermediate", "advanced", "expert"];
  const level = levels[Math.floor(Math.random() * levels.length)];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const AccountInfo = () => {
    return (
      <Card>
        <CardHeader className="flex items-center justify-between gap-2">
          <div className="text-lg font-semibold">Profil</div>
          {isFetching ? <Spinner size="sm" /> : null}
        </CardHeader>

        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Name" value={user?.name ?? "-"} isReadOnly />
          <Input label="Email" value={user?.email ?? "-"} isReadOnly />

          <Input
            name="phone_number"
            label="Phone Number"
            value={user?.phone_number ?? "-"}
            isReadOnly
            isDisabled
            placeholder="-"
            endContent={
              user?.phone_verified_at ? (
                <ShieldCheck className="text-emerald-500" />
              ) : (
                <ShieldAlert className="text-amber-500" />
              )
            }
          />

          <Input
            label="Created"
            value={formatDate(user?.created_at)}
            isReadOnly
          />
          <Input
            label="Updated"
            value={formatDate(user?.updated_at)}
            isReadOnly
          />

          <div className="flex gap-2 pt-2 md:col-span-2">
            <Button variant="flat" onPress={() => refetch()}>
              Refresh
            </Button>
            <Button variant="bordered" isDisabled>
              Edit Profile (soon)
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  };

  const ProjectsInfo = () => {
    return (
      <Card>
        <CardHeader className="flex items-center justify-between gap-2">
          <div className="text-lg font-semibold">Projects</div>
          {isFetching ? <Spinner size="sm" /> : null}
        </CardHeader>
        <CardBody>
          <p>Projects</p>
        </CardBody>
      </Card>
    );
  };

  const CertificationsInfo = () => {
    return (
      <Card>
        <CardHeader className="flex items-center justify-between gap-2">
          <div className="text-lg font-semibold">Certifications</div>
          {isFetching ? <Spinner size="sm" /> : null}
        </CardHeader>
        <CardBody>
          <p>Certifications</p>
        </CardBody>
      </Card>
    );
  };

  const tabs = useMemo(
    () => [
      {
        key: "accountInfo",
        title: "Account",
        icon: <UserIcon />,
        content: <AccountInfo />,
      },
      {
        key: "projectsInfo",
        title: "Projects",
        icon: <FolderIcon />,
        content: <ProjectsInfo />,
      },
      {
        key: "certificationsInfo",
        title: "Certifications",
        icon: <Image />,
        content: <CertificationsInfo />,
      },
    ],
    [user, isFetching],
  );

  if (status === "unauthenticated") {
    return null;
  }

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
      <div className="flex flex-row items-center justify-center gap-2 p-4">
        <Avatar
          src={
            user?.profile_image ? user?.profile_image : "/images/user/user.svg"
          }
          alt={user?.name ?? "User avatar"}
          className="h-24 w-24"
        />
        <div className="flex flex-col items-start justify-center gap-2">
          <p className="text-xl font-semibold capitalize">{user?.name}</p>
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

export default ProfileView;
