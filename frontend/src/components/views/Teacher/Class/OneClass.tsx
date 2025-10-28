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
  AlertTriangle,
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

  // ------- Loading Root -------
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

  // ------- Error Root -------
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

  // ------- Members Tab Content -------
  const MembersContent = (
    <Card className="shadow-sm">
      <CardBody>
        {isMembersLoading || isMembersFetching ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
            ))}
          </div>
        ) : members && members.length > 0 ? (
          <div className="flex flex-col gap-2">
            {members.map((member: TClassroomMember) => (
              <div
                key={member.member_id}
                className="border-default-200 flex items-center justify-between gap-2 rounded-xl border p-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    isBordered
                    size="md"
                    name={member.member_name}
                    src={member.member_image_url ?? undefined}
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium capitalize">
                      {member.member_name}
                    </span>
                    <span className="text-default-500 text-xs">
                      {member.member_email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="light">
                    Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-default-500">No members found for this class.</p>
        )}
      </CardBody>
    </Card>
  );

  // ------- Exams Tab Content -------
  const ExamsContent = (
    <Card className="shadow-sm">
      <CardBody>
        {isExamsLoading || isExamsFetching ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : exams && exams.length > 0 ? (
          <div className="flex flex-col gap-2">
            {exams.map((exam: TClassroomExam) => (
              <div
                key={exam.id}
                className="border-default-200 flex items-center justify-between gap-2 rounded-xl border p-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium capitalize">{exam.title}</span>
                    <span className="text-default-500 text-xs"></span>
                    <span className="text-default-500 text-xs">
                      {exam.description}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="light">
                    Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-default-500">No exams found for this class.</p>
        )}
      </CardBody>
    </Card>
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
              {MembersContent}
            </Tab>

            <Tab key="exams" title="Exams">
              {ExamsContent}
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
