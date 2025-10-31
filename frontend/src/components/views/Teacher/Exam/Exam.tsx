// src/components/views/Teacher/Exams/MyExamsTeacher.tsx
import {
  Card,
  CardHeader,
  Divider,
  CardFooter,
  Spinner,
  Button,
  Input,
} from "@heroui/react";
import { useRouter } from "next/router";
import { useExams } from "@/hooks/exam/useExams";
import type { IExam } from "@/types/Exam";
import { PenSquare, Eye, Search, Filter, X, TextSearch } from "lucide-react";
import PaginationControls from "@/components/ui/PaginationControls";
import { useSearchQuery } from "@/hooks/ui/useSearchQuery";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import ClassSearch from "@/components/ui/ClassSearch";

const MyExamsTeacher = () => {
  const [page, setPage] = React.useState(1);
  const [showSearch, setShowSearch] = React.useState(false);
  const { text, debounced, onChange } = useSearchQuery({
    paramName: "q",
    debounceMs: 400,
    onDebouncedChange: () => setPage(1),
  });

  const router = useRouter();
  const { data, isLoading } = useExams({ q: debounced, page, pageSize: 8 });

  const exams: IExam[] = (data as any)?.data ?? (data as any) ?? [];
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
    <div>
      {/* Header actions */}
      <div className="mb-4 flex items-center justify-between md:justify-end">
        {/* Input Search */}
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

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="light"
            isIconOnly
            startContent={<Filter className="h-4 w-4" />}
            onPress={() => router.push("/dashboard/teacher/exams")}
          ></Button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {exams.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-4">
            <p className="text-default-500">No exam found</p>
          </div>
        ) : (
          exams.map((exam: IExam) => (
            <Card key={exam.id} className="overflow-hidden">
              <CardHeader className="flex flex-col items-start gap-2 p-4">
                <div className="w-full items-start gap-2">
                  <h3 className="text-md line-clamp-2 font-semibold">
                    {exam.title}
                  </h3>
                  <p className="text-small text-default-500">
                    {exam.classroom_name}
                  </p>
                </div>
              </CardHeader>

              <Divider />

              <CardFooter className="flex flex-col gap-3 p-4">
                {/* <div className="text-small flex w-full justify-between">
                  <span className="text-default-500">Questions</span>
                  <span className="font-semibold">{exam.total_questions}</span>
                </div> */}
                <div className="text-small flex w-full justify-between">
                  <span className="text-default-500">Duration</span>
                  <span className="font-semibold">
                    {exam.duration_minutes + " minutes"}
                  </span>
                </div>
                <div className="text-small flex w-full justify-between">
                  <span className="text-default-500">Passing</span>
                  <span className="font-semibold">{exam.passing_score}%</span>
                </div>

                {/* Teacher actions */}
                <div className="mt-1 grid w-full grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<PenSquare className="h-4 w-4" />}
                    onPress={() => {
                      router.push(`/dashboard/teacher/exams/${exam.id}/update`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<Eye className="h-4 w-4" />}
                    onPress={() => {
                      router.push(`/dashboard/teacher/exams/${exam.id}`);
                    }}
                  >
                    Preview
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
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

export default MyExamsTeacher;
