import { Input, Button, Link } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { Selected } from "./useRegister";

type Props = {
  setSelected: Dispatch<SetStateAction<Selected>>;
};

export function LoginForm({ setSelected }: Props) {
  return (
    <form className="flex flex-col gap-4">
      <Input
        isRequired
        label="Email"
        placeholder="Enter your email"
        type="email"
        color="primary"
      />
      <Input
        isRequired
        label="Password"
        placeholder="Enter your password"
        type="password"
        color="primary"
      />
      <p className="text-small text-end">
        <Link size="sm" onPress={() => setSelected("forgotpassword")}>
          Lupa Password?
        </Link>
      </p>

      <div className="flex justify-end gap-2">
        <Button fullWidth color="primary">
          Login
        </Button>
      </div>
      <p className="text-small text-center">
        Need to create an account?{" "}
        <Link size="sm" onPress={() => setSelected("register")}>
          Sign up
        </Link>
      </p>
    </form>
  );
}
