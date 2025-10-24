import React from "react";
import { Card, CardFooter, CardBody, Image, Spinner } from "@heroui/react";
import { useClassrooms } from "@/hooks/classroom/useClassrooms";
import { useRouter } from "next/router";
import type { IClassroom } from "@/types/Classroom";

const MyClass = () => {
  const router = useRouter();
  const { data, isLoading } = useClassrooms({ pageSize: 4, page: 1 });

  const classrooms = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-xl font-bold">My Class</h1>
        <p
          className="text-primary cursor-pointer hover:underline"
          onClick={() => router.push("/dashboard/user/class-room")}
        >
          View all
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {classrooms.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-4">
            <p className="text-default-500">No class found</p>
          </div>
        ) : (
          classrooms.map((classroom: IClassroom) => (
            <Card
              key={classroom.id}
              isPressable
              onPress={() =>
                router.push(`/dashboard/user/class-room/${classroom.id}`)
              }
              className="overflow-hidden"
            >
              <CardBody className="p-0">
                <Image
                  src={classroom.image_url || "https://picsum.photos/600"}
                  alt={classroom.name}
                  width={800}
                  height={200}
                  className="h-40 w-full object-cover"
                  radius="none"
                />
              </CardBody>

              <CardFooter className="flex flex-col items-start gap-2 p-4">
                <h2 className="font-semibold">{classroom.name}</h2>
                <p className="text-foreground/60 line-clamp-2 text-sm">
                  {classroom.description || "No description"}
                </p>
                <div className="flex w-full items-center justify-between text-sm">
                  <span className="text-foreground/60">Code:</span>
                  <span className="font-mono text-xs font-semibold">
                    {classroom.code}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyClass;
