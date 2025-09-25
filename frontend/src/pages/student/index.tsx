import DashboardLayout from "@/components/layouts/DashboardLayout";

const DashboardMemberPage = () => {
  return (
    <DashboardLayout title="Student" type="student" isOpen={true}>
      <h1>Student page</h1>
    </DashboardLayout>
  );
};

export default DashboardMemberPage;
