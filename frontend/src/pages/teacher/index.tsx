import DashboardLayout from "@/components/layouts/DashboardLayout";

const DashboardMemberPage = () => {
  return (
    <DashboardLayout title="Teacher" type="teacher" isOpen={true}>
      <h1>Teacher page</h1>
    </DashboardLayout>
  );
};

export default DashboardMemberPage;
