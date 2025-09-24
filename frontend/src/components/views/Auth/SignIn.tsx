import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Button,
  Input,
} from "@heroui/react";

import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function SignIn() {
  const { visibility, toggleVisibility } = usePasswordVisibility(["password"]);
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
          <div className="flex flex-col gap-4">
            <Input
              isClearable
              defaultValue="junior@heroui.com"
              label="Email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              onClear={() => {}}
            />
            <Input
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
            />
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex w-full flex-col justify-center">
          <Button size="sm" color="primary" onPress={() => {}}>
            Sign In
          </Button>
          <p className="text-default-500 text-sm">
            You don't have an account?
            <Link color="primary" href="/auth/signup" size="sm">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
