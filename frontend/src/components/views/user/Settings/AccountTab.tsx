import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Spinner,
  Form,
} from "@heroui/react";
import { ProfileForm } from "@/types/Profile";
import { ShieldCheck, ShieldAlert, EditIcon, CheckIcon } from "lucide-react";
import { useUpdateProfile } from "@/hooks/user/useUpdateProfile";
import { useProfile } from "@/hooks/user/useProfile";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";

export default function AccountTab({
  formUser,
  isFetching,
}: {
  formUser: ProfileForm;
  isFetching: boolean;
}) {
  const { data: profile } = useProfile();

  const user = profile?.data ?? formUser;

  const {
    control,
    onSubmit,
    errors,
    isPending,
    isDirty,
    isValid,
    reset,
    messageUpdated,
    setMessageUpdated,
  } = useUpdateProfile({ name: formUser.name });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.name) {
      reset({ name: user.name }, { keepDirty: false, keepErrors: true });
    }
  }, [user?.name, reset]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="text-lg font-semibold">Profil</div>
        {isFetching ? <Spinner size="sm" /> : null}
      </CardHeader>

      {messageUpdated && !isEditing && (
        <p className="text-success pl-3 text-sm">{messageUpdated}</p>
      )}

      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form onSubmit={onSubmit} id="account-form">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                label="Name"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  if (messageUpdated) setMessageUpdated(null);
                }}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                maxLength={60}
                readOnly={!isEditing}
                endContent={
                  isEditing ? (
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => setIsEditing(false)}
                      isDisabled={isPending || !isValid}
                    >
                      <CheckIcon />
                    </Button>
                  ) : (
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => {
                        setIsEditing(true);
                        if (messageUpdated) setMessageUpdated(null);
                      }}
                    >
                      <EditIcon />
                    </Button>
                  )
                }
              />
            )}
          />

          <p className="text-danger pl-3 text-sm">
            {errors.root?.message ?? ""}
          </p>
        </Form>

        <Input
          name="email"
          label="Email"
          value={formUser.email || ""}
          readOnly
          placeholder="-"
          endContent={
            !formUser.email_verified_at && (
              <Button variant="solid" color="primary" size="sm">
                <p>Confirm</p>
              </Button>
            )
          }
        />

        <Input
          name="phone_number"
          label="Phone Number"
          value={formUser.phone_number || ""}
          readOnly
          isDisabled
          placeholder="-"
          endContent={
            formUser.phone_verified_at ? (
              <ShieldCheck className="text-emerald-500" />
            ) : (
              <ShieldAlert className="text-amber-500" />
            )
          }
        />

        <div className="flex gap-2 pt-2 md:col-span-2">
          <Button
            variant="flat"
            type="submit"
            form="account-form"
            color="primary"
            isDisabled={!isDirty || !isValid || isPending || isEditing}
          >
            {isPending ? <Spinner size="sm" /> : "Submit"}
          </Button>
          <Button
            variant="bordered"
            type="button"
            onPress={() => {
              reset({ name: formUser.name });
              if (messageUpdated) setMessageUpdated(null);
              setIsEditing(false);
            }}
            isDisabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
