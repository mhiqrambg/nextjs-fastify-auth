import DashboardLayout from "@/components/layouts/DashboardLayout";
import { MyClass, JoinClass } from "@/components/views/user/Class";

const ClassRoom = () => {
  return (
    <DashboardLayout title="Class Room" type="user" isOpen={false}>
      <JoinClass />
      <MyClass />
    </DashboardLayout>
  );
};

export default ClassRoom;
