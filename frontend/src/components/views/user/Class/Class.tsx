import React from "react";
import {
  Card,
  CardFooter,
  CardBody,
  Image,
  Button,
  Spinner,
} from "@heroui/react";
import PaginationControls from "@/components/ui/PaginationControls";
import { useSearchQuery } from "@/hooks/ui/useSearchQuery";
import ClassSearch from "@/components/ui/ClassSearch";
import { TextSearch, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useClassrooms } from "@/hooks/classroom/useClassrooms";
import { useRouter } from "next/router";
import type { TClassroom } from "@/types/Classroom";

const Class = () => {
  const router = useRouter();
  const [showSearch, setShowSearch] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const { text, debounced, onChange } = useSearchQuery({
    paramName: "q",
    debounceMs: 400,
    onDebouncedChange: () => setPage(1),
  });

  const { data, isLoading } = useClassrooms({
    q: debounced,
    page,
    pageSize: 8,
  });

  const classrooms = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Class</h1>

        <div className="flex items-end justify-end gap-2">
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.7 }}
              >
                <ClassSearch value={text} onChange={onChange} />
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onPress={() => setShowSearch(!showSearch)}
            isIconOnly
            variant="light"
            className="hover:bg-transparent hover:opacity-100"
            fullWidth
          >
            {showSearch ? <X size={24} /> : <TextSearch size={24} />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {classrooms.map((classroom: TClassroom) => (
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
                <span className="font-mono font-semibold">
                  {classroom.code}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onChange={setPage}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default Class;
