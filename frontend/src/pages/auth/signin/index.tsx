import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import SignIn from "@/components/views/auth/SignIn";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default function Signin() {
  return (
    <AuthLayout title="Quizolah | Signin">
      <SignIn />
    </AuthLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/user/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
