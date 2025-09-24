import Footer from "@/components/layouts/Footer/Footer";
import Sidebar from "@/components/layouts/Sidebar";
import PageHead from "@/components/commons/PageHead";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHead title="Dashboard" />
      <Sidebar />
      <div className="ml-0 flex min-h-screen flex-1 flex-col md:ml-64">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
