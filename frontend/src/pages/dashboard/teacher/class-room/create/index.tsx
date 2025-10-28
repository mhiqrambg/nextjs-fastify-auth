import DashboardLayout from "@/components/layouts/DashboardLayout";
import CreateClass from "@/components/views/Teacher/Class/CreateClass";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const TeacherClassRoomCreate = () => {
  const breadcrumbs = [
    { label: "Class Room", href: "/dashboard/teacher/class-room" },
    { label: "Create", href: "/dashboard/teacher/class-room/create" },
  ];

  return (
    <DashboardLayout title="Create Class" type="teacher" isOpen={true}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <CreateClass />
    </DashboardLayout>
  );
};

export default TeacherClassRoomCreate;
