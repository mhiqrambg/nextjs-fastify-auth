import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProfileView } from "@/components/views/user/Profile";

const Profile = () => {
  return (
    <DashboardLayout title="Profile" type="user" isOpen={true}>
      <ProfileView />
    </DashboardLayout>
  );
};

export default Profile;
