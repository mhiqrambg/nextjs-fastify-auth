import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "@heroui/react";

import { useProfile } from "@/hooks/user/useProfile";

const Dashboard = () => {
  const { data: profile, isLoading } = useProfile();
  console.log("profile", profile);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const classroomLength = profile?.data?.classrooms?.length || 0;

  const examLength = profile?.data?.exams?.length || 0;
  const examDoneLength =
    profile?.data?.user_exams?.filter(
      (exam: any) => exam.status === "completed",
    ).length || 0;

  const list = [
    {
      id: 1,
      title: "My Class",
      total: classroomLength,
    },
    {
      id: 2,
      title: "My Exam",
      total: examLength,
    },
    {
      id: 3,
      title: "Exam Done",
      total: examDoneLength,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid sm:grid-cols-4">
        <Dropdown backdrop="blur">
          <DropdownTrigger>
            <Card className="h-20 justify-center sm:h-auto" isPressable>
              <CardHeader className="items-center justify-center gap-4">
                <Avatar
                  src={profile?.data?.profile_image}
                  name={profile?.data?.name}
                  className="border-quiz-navy ca border p-0.5"
                />
                <div className="min-w-0 items-start">
                  <h1 className="truncate text-left font-bold">
                    {profile?.data?.name}
                  </h1>
                  <p className="text-foreground/60 truncate text-sm">
                    {profile?.data?.email}
                  </p>
                </div>
              </CardHeader>
            </Card>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" variant="faded">
            {list.map((item) => (
              <DropdownItem
                key={item.id}
                isReadOnly
                description={`${item.total} items`}
              >
                {item.title}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {list.map((item) => (
          <Card
            key={item.id}
            className="hidden h-auto overflow-hidden sm:block"
          >
            <CardBody className="flex items-center justify-between">
              <div>
                <h2>{item.title}</h2>
              </div>
              <span className="text-quiz-navy text-3xl font-bold">
                {item.total}
              </span>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
