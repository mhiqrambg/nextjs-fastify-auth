import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Settings } from "@/components/views/user/Settings";

const SettingsPage = () => {
  return (
    <DashboardLayout title="Settings" type="user" isOpen={true}>
      <Settings />
    </DashboardLayout>
  );
};

export default SettingsPage;
