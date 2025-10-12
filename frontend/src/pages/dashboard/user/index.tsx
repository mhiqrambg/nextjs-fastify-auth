import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Dashboard, MyClass, MyExam } from "@/components/views/user/Dashbaord";

const DashboardUsers = () => {
  return (
    <DashboardLayout title="Dashboard" type="user" isOpen={true}>
      <Dashboard />
      <MyClass />
      <MyExam />
    </DashboardLayout>
  );
};

export default DashboardUsers;
