import { Card, CardBody, CardHeader, Image, Skeleton } from "@heroui/react";
import { useRegister, Selected } from "./useRegister";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { OtpForm } from "./OtpForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import React from "react";

const Auth = () => {
  const { selected, setSelected, otp, setOtp } = useRegister();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tab = query.get("tab");

    const validTabs: Selected[] = ["login", "register", "forgotpassword"];

    if (tab && validTabs.includes(tab as Selected)) {
      setSelected(tab as Selected);
    } else {
      setSelected("login");
    }
  }, [setSelected]);

  React.useEffect(() => {
    // simulasi API loading
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const steps: Record<Selected, React.ReactNode> = {
    login: <LoginForm setSelected={setSelected} />,
    register: <RegisterForm setSelected={setSelected} />,
    otp: <OtpForm otp={otp || ""} setOtp={setOtp} />,
    forgotpassword: <ForgotPasswordForm setSelected={setSelected} />,
  };

  return (
    <div className="absolute inset-0 flex min-h-screen w-full items-center justify-center bg-gradient-to-tr p-8">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 rounded-2xl bg-white p-4 shadow-2xl backdrop-blur-lg md:grid-cols-2">
        {/* Left Side - Image with skeleton */}
        <div className="hidden flex-col items-center justify-center overflow-hidden rounded-xl md:flex">
          <Skeleton isLoaded={!isLoading} className="h-full w-full rounded-xl">
            <Image
              alt="Authentication Illustration"
              src="https://heroui.com/images/hero-card.jpeg"
              className="h-full w-full object-cover"
            />
          </Skeleton>
        </div>

        {/* Right Side - Auth Card */}
        <Card className="w-full border-none bg-transparent shadow-none">
          <CardHeader>
            <h1 className="w-full text-center text-3xl font-bold text-gray-800">
              {selected === "login"
                ? "Login"
                : selected === "register"
                  ? "Pendaftaran Akun"
                  : selected === "forgotpassword"
                    ? "Lupa Password"
                    : "Verifikasi OTP"}
            </h1>
          </CardHeader>

          <CardBody className="flex flex-col justify-center gap-4">
            <div>{steps[selected]}</div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
