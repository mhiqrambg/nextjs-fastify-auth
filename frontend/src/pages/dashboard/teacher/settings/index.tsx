import DashboardLayout from "@/components/layouts/DashboardLayout";
import TeacherSettingsView from "@/components/views/Teacher/Settings";

const TeacherSettingsPage = () => {
  return (
    <DashboardLayout title="Settings" type="teacher" isOpen={true}>
      <TeacherSettingsView />
    </DashboardLayout>
  );
};

export default TeacherSettingsPage;
