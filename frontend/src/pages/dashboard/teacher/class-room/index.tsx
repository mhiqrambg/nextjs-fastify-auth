import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Class } from "@/components/views/Teacher/Class";

const TeacherClassRoom = () => {
  return (
    <DashboardLayout title="Class Room" type="teacher" isOpen={true}>
      <Class />
    </DashboardLayout>
  );
};

export default TeacherClassRoom;
