import DashboardLayout from "@/components/layouts/DashboardLayout";
import TeacherProfileView from "@/components/views/Teacher/Profile";

const TeacherProfilePage = () => {
  return (
    <DashboardLayout title="Profile" type="teacher" isOpen={true}>
      <TeacherProfileView />
    </DashboardLayout>
  );
};

export default TeacherProfilePage;
