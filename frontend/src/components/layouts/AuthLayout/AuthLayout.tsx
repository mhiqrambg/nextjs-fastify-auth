import PageHead from "@/components/commons/PageHead";
import NavBar from "../NavBar/NavBar";

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
    </>
  );
};

export default AuthLayout;
