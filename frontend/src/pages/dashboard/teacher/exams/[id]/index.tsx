import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ExamDetail } from "@/components/views/Teacher/Exam";
import { useRouter } from "next/router";
import React from "react";

const TeacherExamDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const breadcrumbs = [
    { label: "Exams", href: "/dashboard/teacher/exams" },
    { label: "Exam Detail", href: `/dashboard/teacher/exams/${id}` },
  ];

  return (
    <DashboardLayout title="Exam Detail" type="teacher" isOpen={true}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <ExamDetail id={id as string} />
    </DashboardLayout>
  );
};

export default TeacherExamDetail;
