import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Button,
  Input,
  Form,
} from "@heroui/react";

import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Controller } from "react-hook-form";

import { useState } from "react";
import { useLogin } from "@/hooks/auth/useLogin";

export default function SignIn() {
  const { visibility, toggleVisibility } = usePasswordVisibility(["password"]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleLogin, control, errors, handleSubmit } = useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-4 w-full md:w-1/3">
        <CardHeader className="flex w-full flex-col justify-center">
          <h1 className="text-1xl font-semibold">Sign In</h1>
          <p className="text-default-500 text-sm">
            Sign in to your account to continue
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          <Form onSubmit={handleSubmit(handleLogin)} id="login-form">
            <div className="flex flex-col gap-4">
              {error && (
                <div className="text-danger bg-danger-50 rounded-md p-2 text-sm">
                  {error}
                </div>
              )}
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    defaultValue="junior@heroui.com"
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                    variant="bordered"
                    autoComplete="off"
                    onClear={() => {}}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    {...field}
                    autoComplete="off"
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="outline-transparent focus:outline-solid"
                        type="button"
                        onClick={() => toggleVisibility("password")}
                      >
                        {visibility.password ? (
                          <EyeIcon className="text-default-400 pointer-events-none text-2xl" />
                        ) : (
                          <EyeOffIcon className="text-default-400 pointer-events-none text-2xl" />
                        )}
                      </button>
                    }
                    label="Password"
                    placeholder="Enter your password"
                    type={visibility.password ? "text" : "password"}
                    variant="bordered"
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                  />
                )}
              />
            </div>
          </Form>
        </CardBody>
        <Divider />
        <CardFooter className="flex w-full flex-col justify-center">
          <Button
            size="sm"
            color="primary"
            type="submit"
            form="login-form"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
          <p className="text-default-500 text-sm">
            You don&apos;t have an account?
            <Link color="primary" href="/auth/signup" size="sm">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
