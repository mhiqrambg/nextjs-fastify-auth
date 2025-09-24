import PageHead from "@/components/commons/PageHead";
import Navbar from "@/components/layouts/NavBar/NavBar";
import Footer from "@/components/layouts/Footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHead title="Quizolah - Platform Ujian" />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
