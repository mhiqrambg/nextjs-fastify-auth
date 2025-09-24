import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import SignIn from "@/components/views/auth/SignIn";

export default function Signin() {
  return (
    <AuthLayout title="Quizolah | Signin">
      <SignIn />
    </AuthLayout>
  );
}
