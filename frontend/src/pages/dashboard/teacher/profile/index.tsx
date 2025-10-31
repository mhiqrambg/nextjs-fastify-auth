import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProfileView } from "@/components/views/Teacher/Profile";

const TeacherProfilePage = () => {
  return (
    <DashboardLayout title="Profile" type="teacher" isOpen={true}>
      <ProfileView />
    </DashboardLayout>
  );
};

export default TeacherProfilePage;
