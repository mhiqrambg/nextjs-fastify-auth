// src/components/views/Teacher/ClassroomForm.tsx
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Input,
  Textarea,
  Divider,
  Alert,
} from "@heroui/react";
import { Controller } from "react-hook-form";
import ImageUpload from "@/components/ui/ImageUpload";
import {
  TCreateClassroomSchema,
  useCreateClassroom,
} from "@/hooks/classroom/useClassrooms";
import { useRouter } from "next/router";
import { useState } from "react";

type ClassroomFormProps = {
  onCancel?: () => void;
};

export default function ClassroomForm({ onCancel }: ClassroomFormProps) {
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    createClassroomAsync,
    reset,
    formState: { errors, isValid, isSubmitting: formSubmitting },
    isSubmitting,
  } = useCreateClassroom();

  const submitting = isSubmitting || formSubmitting;

  const onSubmitValid = async (values: TCreateClassroomSchema) => {
    const res = await createClassroomAsync(values);
    const id =
      res?.id || res?.data?.id || res?.classroom?.id || res?.payload?.id;

    setSuccessMsg("Classroom berhasil dibuat.");

    try {
      setTimeout(() => {
        setSuccessMsg(null);

        if (id) {
          router.push(`/dashboard/teacher/class-room/${id}`);
        } else {
          router.push(`/dashboard/teacher/class-room`);
        }
      }, 3000);

      reset();
    } catch {
      router.push(`/dashboard/teacher/class-room`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitValid)}>
      {successMsg && (
        <Alert color="success" className="mb-4">
          {successMsg}
        </Alert>
      )}
      <Card shadow="sm" className="p-3">
        <CardBody className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Classroom Name"
                    placeholder="Matematika Dasar"
                    isRequired
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Description"
                    placeholder="Kelas fisika dasar"
                    minRows={5}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                  />
                )}
              />
            </div>

            {/* Right side - Image */}
            <Controller
              name="imageFile"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <ImageUpload
                    label="Classroom Image"
                    onFileSelect={(file) => field.onChange(file)}
                    recommendedSizeText="Recommended size: 800x400px"
                  />
                  {errors.imageFile && (
                    <span className="text-danger text-sm">
                      {String(errors.imageFile.message)}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <Divider />

          <div className="flex justify-end gap-3">
            <Button variant="light" onPress={onCancel} isDisabled={submitting}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={submitting}
              isDisabled={!isValid || submitting}
            >
              Add Classroom
            </Button>
          </div>
        </CardBody>
        <CardFooter />
      </Card>
    </form>
  );
}
