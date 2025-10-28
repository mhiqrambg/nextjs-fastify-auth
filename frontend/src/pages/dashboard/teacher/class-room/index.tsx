import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Class, CreateClass } from "@/components/views/Teacher/Class";

const TeacherClassRoom = () => {
  return (
    <DashboardLayout title="Class Room" type="teacher" isOpen={true}>
      {/* <CreateClass /> */}
      <Class />
    </DashboardLayout>
  );
};

export default TeacherClassRoom;
