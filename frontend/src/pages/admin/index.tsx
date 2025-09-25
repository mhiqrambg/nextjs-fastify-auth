import DashboardLayout from "@/components/layouts/DashboardLayout";

const DashboardMemberPage = () => {
  return (
    <DashboardLayout title="Admin" type="admin" isOpen={true}>
      <h1>Admin page</h1>
    </DashboardLayout>
  );
};

export default DashboardMemberPage;
