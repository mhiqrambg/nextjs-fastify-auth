import AuthLayout from "@/components/layouts/AuthLayout";
import Auth from "@/components/views/Auth";

export default function AuthPage() {
  return (
    <div>
      <AuthLayout title="Auth">
        <Auth />
      </AuthLayout>
    </div>
  );
}
