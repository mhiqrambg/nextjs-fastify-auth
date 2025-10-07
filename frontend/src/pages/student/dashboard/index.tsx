import DashboardLayout from "@/components/layouts/DashboardLayout";

const DashboardStudent = () => {
  return (
    <DashboardLayout title="Student" type="student" isOpen={true}>
      <h1>Student page</h1>
    </DashboardLayout>
  );
};

export default DashboardStudent;
