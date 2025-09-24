import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import Register from "@/components/views/auth/Register";

export default function Signup() {
  return (
    <AuthLayout title="Quizolah | Signup">
      <Register />
    </AuthLayout>
  );
}
