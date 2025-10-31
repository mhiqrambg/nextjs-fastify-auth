import DashboardLayout from "@/components/layouts/DashboardLayout";
import { TeacherExam } from "@/components/views/Teacher/Exam";

const TeacherExamPage = () => {
  return (
    <DashboardLayout title="Exams" type="teacher" isOpen={true}>
      <TeacherExam />
    </DashboardLayout>
  );
};

export default TeacherExamPage;
