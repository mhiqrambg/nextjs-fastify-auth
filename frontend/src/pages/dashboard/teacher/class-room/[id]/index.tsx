import DashboardLayout from "@/components/layouts/DashboardLayout";
import { OneClass } from "@/components/views/Teacher/Class";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useRouter } from "next/router";
import { useEffect } from "react";

const TeacherClassRoomDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const breadcrumbs = [
    { label: "Class Room", href: "/dashboard/teacher/class-room" },
    { label: "Class Room Detail", href: `/dashboard/teacher/class-room/${id}` },
  ];

  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <DashboardLayout title="Class Room Detail" type="teacher" isOpen={true}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <OneClass id={id as string} />
    </DashboardLayout>
  );
};

export default TeacherClassRoomDetail;
