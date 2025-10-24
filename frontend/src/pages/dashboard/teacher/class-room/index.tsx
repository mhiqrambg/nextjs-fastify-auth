import DashboardLayout from "@/components/layouts/DashboardLayout";
import { TeacherClass } from "@/components/views/Teacher/Class";

const TeacherClassRoom = () => {
  return (
    <DashboardLayout title="Class Room" type="teacher" isOpen={true}>
      <TeacherClass />
    </DashboardLayout>
  );
};

export default TeacherClassRoom;
