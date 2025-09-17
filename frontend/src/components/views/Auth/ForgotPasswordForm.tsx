import { Input, Button, Link } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { Selected } from "./useRegister";

type Props = {
  setSelected: Dispatch<SetStateAction<Selected>>;
};

export function ForgotPasswordForm({ setSelected }: Props) {
  return (
    <form className="flex flex-col gap-4">
      <Input
        isRequired
        label="Email"
        placeholder="Enter your registered email"
        type="email"
      />
      <p className="text-small text-center">
        Remembered your password?{" "}
        <Link size="sm" onPress={() => setSelected("login")}>
          Back to Login
        </Link>
      </p>
      <div className="flex justify-end gap-2">
        <Button fullWidth color="primary">
          Reset Password
        </Button>
      </div>
    </form>
  );
}
