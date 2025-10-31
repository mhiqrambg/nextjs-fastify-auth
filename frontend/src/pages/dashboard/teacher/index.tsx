import DashboardLayout from "@/components/layouts/DashboardLayout";
import SettingsView from "@/components/views/Teacher/Settings/Settings";

const DashboardTeacher = () => {
  return (
    <DashboardLayout title="Teacher" type="teacher" isOpen={true}>
      <SettingsView />
    </DashboardLayout>
  );
};

export default DashboardTeacher;
