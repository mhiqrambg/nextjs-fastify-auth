import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Spinner,
} from "@heroui/react";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function SecurityTab({ isFetching }: { isFetching: boolean }) {
  const { visibility, toggleVisibility } = usePasswordVisibility([
    "password",
    "re_password",
  ]);
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="text-lg font-semibold">Passwords and security</div>
        {isFetching ? <Spinner size="sm" /> : null}
      </CardHeader>
      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          name="password"
          label="Password"
          placeholder="New password"
          type={visibility.password ? "text" : "password"}
          value=""
          autoComplete="new-password"
          endContent={
            <Button
              isIconOnly
              variant="light"
              onPress={() => toggleVisibility("password")}
            >
              {visibility.password ? <EyeIcon /> : <EyeOffIcon />}
            </Button>
          }
        />

        <Input
          name="re_password"
          label="Confirm Password"
          placeholder="Confirm password"
          type={visibility.re_password ? "text" : "password"}
          value=""
          autoComplete="new-password"
          endContent={
            <Button
              isIconOnly
              variant="light"
              onPress={() => toggleVisibility("re_password")}
            >
              {visibility.re_password ? <EyeIcon /> : <EyeOffIcon />}
            </Button>
          }
        />
      </CardBody>
    </Card>
  );
}
