import { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  Tooltip,
  Avatar,
  Link,
  Tabs,
  Tab,
  Skeleton,
} from "@heroui/react";
import {
  Copy,
  Mail,
  RefreshCw,
  CalendarClock,
  User2,
  Hash,
  Info,
  Settings,
} from "lucide-react";
import {
  useClassroom,
  useClassroomExams,
} from "@/hooks/classroom/useClassrooms";
import { useMembers } from "@/hooks/classroom/useMembers";
import {
  TClassroom,
  TClassroomExam,
  TClassroomMember,
} from "@/types/Classroom";
import { formatDate } from "@/utils/date";
import { initials } from "@/utils/string";
import { TExams, TMembers } from "@/components/views/Teacher/Class";
import { useDeleteClassroom } from "@/hooks/classroom/useClassrooms";
import { useRouter } from "next/router";

export default function OneClass({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "exams">(
    "overview",
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useClassroom(id);

  const {
    data: membersData,
    isLoading: isMembersLoading,
    isFetching: isMembersFetching,
    isError: isMembersError,
    error: membersError,
    refetch: refetchMembers,
  } = useMembers(id, { enabled: activeTab === "members" });

  const {
    data: examsData,
    isLoading: isExamsLoading,
    isFetching: isExamsFetching,
    isError: isExamsError,
    error: examsError,
    refetch: refetchExams,
  } = useClassroomExams(id, { enabled: activeTab === "exams" });

  const classroom = useMemo<TClassroom | null>(() => {
    const raw = (data as any)?.data ?? (data as any) ?? null;
    return raw as TClassroom | null;
  }, [data]);

  const members = useMemo<TClassroomMember[] | undefined>(() => {
    return (membersData as any)?.data ?? (membersData as any);
  }, [membersData]);

  const exams = useMemo<TClassroomExam[] | undefined>(() => {
    return (examsData as any)?.data ?? (examsData as any);
  }, [examsData]);

  const deleteMutation = useDeleteClassroom();
  const router = useRouter();

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the class: ${classroom?.name}?`,
      )
    ) {
      deleteMutation.mutate(classroom?.id ?? "");
      router.push("/dashboard/teacher/class-room");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardBody>
              <Skeleton className="mb-3 h-6 w-48" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Skeleton className="mb-3 h-6 w-40" />
              <Skeleton className="h-10 w-full" />
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-danger-200 bg-danger-50/40">
        <CardHeader className="flex items-center gap-2">
          <Info className="text-danger h-5 w-5" />
          <div className="font-semibold">Failed to load class</div>
        </CardHeader>
        <CardBody className="pt-0">
          <p className="text-danger-600 text-sm">
            {(error as any)?.message ?? "An unexpected error occurred."}
          </p>
          <div className="mt-3">
            <Button
              size="sm"
              startContent={<RefreshCw className="h-4 w-4" />}
              onPress={() => refetch()}
            >
              Try again
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!classroom) {
    return (
      <Card>
        <CardBody>
          <p className="text-default-500">Class not found.</p>
        </CardBody>
      </Card>
    );
  }

  // ------- Header -------
  const banner = classroom.image_url || "https://picsum.photos/800";

  const Header = (
    <div className="border-default-200 relative overflow-hidden rounded-2xl border">
      {banner ? (
        <Image
          src={banner}
          radius="none"
          removeWrapper
          alt={classroom.name}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="from-primary/15 via-primary/5 h-48 w-full bg-gradient-to-br to-transparent" />
      )}

      <div className="from-background/80 via-background/40 absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-gradient-to-t to-transparent p-5">
        <div className="flex items-center gap-4">
          <Avatar
            isBordered
            size="lg"
            name={initials(classroom.name)}
            src={banner ?? undefined}
            classNames={{ base: "shadow-md" }}
          />
          <div>
            <h1 className="text-2xl leading-tight font-bold">
              {classroom.name}
            </h1>
            <div className="text-default-500 mt-1 flex flex-wrap items-center gap-2 text-sm">
              <Chip
                size="sm"
                variant="flat"
                startContent={<Hash className="h-3.5 w-3.5" />}
              >
                {classroom.code}
              </Chip>
              <span className="inline-flex items-center gap-1">
                <CalendarClock className="h-4 w-4" /> Created{" "}
                {formatDate(classroom.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {Header}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left column */}
        <div className="order-2 flex flex-col gap-4 md:order-1 md:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="flex items-center gap-2">
              <Info className="text-primary h-5 w-5" />
              <div className="font-semibold">Class Summary</div>
            </CardHeader>
            <CardBody className="pt-0">
              <p className="text-default-600 whitespace-pre-line">
                {classroom.description ||
                  "No description available for this class."}
              </p>
              <Divider className="my-4" />
              <div className="text-default-500 flex flex-wrap items-center gap-2 text-sm">
                <Chip variant="flat" size="sm">
                  Updated {formatDate(classroom.updated_at)}
                </Chip>
              </div>
            </CardBody>
          </Card>

          <Tabs
            aria-label="Class details"
            color="primary"
            variant="underlined"
            className="px-1"
            selectedKey={activeTab}
            onSelectionChange={(key) =>
              setActiveTab(key as "overview" | "members" | "exams")
            }
          >
            <Tab key="overview" title="Overview">
              <Card className="shadow-sm">
                <CardBody>
                  <p className="text-default-600">
                    No content available for this class.
                  </p>
                </CardBody>
              </Card>
            </Tab>

            <Tab
              key="members"
              title={
                <div className="inline-flex items-center gap-2">
                  <span>Members</span>
                  {Array.isArray(members) ? (
                    <Chip size="sm" variant="flat">
                      {members.length}
                    </Chip>
                  ) : null}
                </div>
              }
            >
              <TMembers
                isMembersLoading={isMembersLoading}
                isMembersFetching={isMembersFetching}
                members={members ?? []}
              />
            </Tab>

            <Tab key="exams" title="Exams">
              <TExams
                isExamsLoading={isExamsLoading}
                isExamsFetching={isExamsFetching}
                exams={exams ?? []}
              />
            </Tab>
          </Tabs>
        </div>

        {/* Right column */}
        <div className="order-1 flex flex-col gap-4 md:order-2">
          <Card className="shadow-sm">
            <CardHeader className="flex items-center gap-2">
              <User2 className="text-primary h-5 w-5" />
              <div className="font-semibold">Teacher</div>
            </CardHeader>
            <Divider />
            <CardBody className="px-3 py-2">
              <div className="flex items-center gap-3">
                <Avatar
                  isBordered
                  size="md"
                  name={initials(classroom.teacher_name)}
                  src={classroom.teacher_image_url ?? undefined}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{classroom.teacher_name}</span>
                  <Link
                    href={`mailto:${classroom.teacher_email}`}
                    className="text-default-500 inline-flex items-center gap-1 text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    {classroom.teacher_email}
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex items-center gap-2">
              <Hash className="text-primary h-5 w-5" />
              <div className="font-semibold">Class Code</div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="border-default-200 flex items-center justify-between rounded-xl border px-3 py-2">
                <code className="font-mono text-lg tracking-wide">
                  {classroom.code}
                </code>
                <Tooltip content="Salin">
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() =>
                      navigator.clipboard.writeText(classroom.code)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>
            </CardBody>
          </Card>

          <Card className="p-4 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-primary flex items-center gap-2 font-semibold">
                  <Settings className="text-primary h-5 w-5" /> Manage Class
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  color="primary"
                  size="lg"
                  startContent={<i className="lucide lucide-edit-3" />}
                  className="w-full"
                >
                  Edit
                </Button>
                <Button
                  color="danger"
                  size="lg"
                  startContent={<i className="lucide lucide-trash-2" />}
                  className="w-full"
                  onPress={() => handleDelete()}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {/* Subtle fetch indicator */}
      {isFetching && (
        <div className="text-default-400 flex items-center gap-2 text-xs">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Refreshing data…
        </div>
      )}
    </div>
  );
}
