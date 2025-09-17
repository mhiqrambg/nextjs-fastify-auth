import { Input, Button, Link } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { Selected } from "./useRegister";

type Props = {
  setSelected: Dispatch<SetStateAction<Selected>>;
};

export function RegisterForm({ setSelected }: Props) {
  return (
    <form className="flex flex-col gap-4">
      <Input
        isRequired
        variant="underlined"
        label="Name"
        placeholder="Enter your name"
        type="text"
      />
      <Input
        isRequired
        variant="underlined"
        label="Email"
        placeholder="Enter your email"
        type="email"
      />
      <Input
        isRequired
        variant="underlined"
        label="Phone"
        placeholder="Enter your phone"
        type="tel"
      />
      <Input
        isRequired
        variant="underlined"
        label="Password"
        placeholder="Enter your password"
        type="password"
      />
      <Input
        isRequired
        variant="underlined"
        label="Confirm Password"
        placeholder="Enter your password"
        type="password"
      />
      <p className="text-small text-center">
        Already have an account?
        <Link size="sm" onPress={() => setSelected("login")}>
          Login
        </Link>
      </p>
      <div className="flex justify-end gap-2">
        <Button
          fullWidth
          color="primary"
          onPress={() => setSelected("otp")} // ⬅️ langsung ke step OTP
        >
          Register
        </Button>
      </div>
    </form>
  );
}
