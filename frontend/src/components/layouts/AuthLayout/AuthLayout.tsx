import PageHead from "@/components/commons/PageHead";
import NavBar from "@/components/layouts/NavBar/NavBar";
import Footer from "@/components/layouts/Footer/Footer";

interface PropsTypes {
  title?: string;
  children: React.ReactNode;
}

const AuthLayout = (props: PropsTypes) => {
  const { title, children } = props;
  return (
    <>
      <PageHead title={title} />
      <NavBar />
      <section className="3xl:container max-w-screen-3xl">{children}</section>
      <Footer />
    </>
  );
};

export default AuthLayout;
