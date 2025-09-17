import { Form, InputOtp, Button } from "@heroui/react";

type Props = {
  otp: string;
  setOtp: (value: string) => void;
};

export function OtpForm({ otp, setOtp }: Props) {
  return (
    <Form
      className="flex w-full flex-col items-start gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const code = formData.get("otp");
        setOtp(code as string);
      }}
    >
      <InputOtp
        isRequired
        aria-label="OTP input field"
        length={4}
        name="otp"
        placeholder="Enter code"
      />
      <Button size="sm" type="submit" variant="bordered">
        Submit
      </Button>
      {otp && (
        <div className="text-small text-default-500">OTP submitted: {otp}</div>
      )}
    </Form>
  );
}
