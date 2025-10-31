import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useRouter } from "next/router";

const TeacherExamUpdate = () => {
  const router = useRouter();
  const { id } = router.query;

  const breadcrumbs = [
    { label: "Exams", href: "/dashboard/teacher/exams" },
    { label: "Exam Detail", href: `/dashboard/teacher/exams/${id}` },
    { label: "Update", href: `/dashboard/teacher/exams/${id}/update` },
  ];
  return (
    <DashboardLayout title="Exam Update" type="teacher" isOpen={true}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h1>Exam Update</h1>
    </DashboardLayout>
  );
};

export default TeacherExamUpdate;
