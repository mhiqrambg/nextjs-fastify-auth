import DashboardLayout from "@/components/layouts/DashboardLayout";
import Dashboard from "@/components/views/Teacher/Dashboard/Dashboard";

const DashboardTeacher = () => {
  return (
    <DashboardLayout title="Teacher" type="teacher" isOpen={true}>
      <Dashboard />
    </DashboardLayout>
  );
};

export default DashboardTeacher;
