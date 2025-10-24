import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Spinner,
  Form,
} from "@heroui/react";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useUpdatePassword } from "@/hooks/user/useUpdatePassword";
import { Controller } from "react-hook-form";

export default function SecurityTab({ isFetching }: { isFetching: boolean }) {
  const { visibility, toggleVisibility } = usePasswordVisibility([
    "password",
    "re_password",
  ]);
  const {
    onSubmit,
    errors,
    isPending,
    control,
    isDirty,
    isValid,
    messageUpdated,
    setMessageUpdated,
  } = useUpdatePassword();
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="text-lg font-semibold">Passwords and security</div>
        {isFetching ? <Spinner size="sm" /> : null}
      </CardHeader>

      {messageUpdated && (
        <p className="text-success pl-3 text-sm">{messageUpdated}</p>
      )}
      <Form onSubmit={onSubmit}>
        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                {...field}
                name="password"
                label="Password"
                placeholder="New password"
                type={visibility.password ? "text" : "password"}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  if (messageUpdated) setMessageUpdated(null);
                }}
                autoComplete="new-password"
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
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
            )}
          />

          <Controller
            control={control}
            name="re_password"
            render={({ field }) => (
              <Input
                {...field}
                name="re_password"
                label="Confirm Password"
                placeholder="Confirm password"
                type={visibility.re_password ? "text" : "password"}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  if (messageUpdated) setMessageUpdated(null);
                }}
                autoComplete="new-password"
                isInvalid={!!errors.re_password}
                errorMessage={errors.re_password?.message}
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
            )}
          />
        </CardBody>
        <div className="w-full px-4 pb-4">
          <Button
            type="submit"
            isDisabled={isPending || !isValid}
            isLoading={isPending}
          >
            {isPending ? <Spinner size="sm" /> : "Update Password"}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
