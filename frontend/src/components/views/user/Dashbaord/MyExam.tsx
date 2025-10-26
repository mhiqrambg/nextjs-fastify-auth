import {
  Card,
  CardHeader,
  Divider,
  CardFooter,
  Chip,
  Spinner,
  Button,
} from "@heroui/react";

// hooks
import { useExams } from "@/hooks/exam/useExams";
import { useRouter } from "next/router";
import type { IExam } from "@/types/Exam";

const MyExam = () => {
  const router = useRouter();
  const { data, isLoading } = useExams({ pageSize: 5, page: 1 });

  const exams = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "danger";
      default:
        return "default";
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-xl font-bold">My Exam</h1>
        <p
          className="text-primary cursor-pointer hover:underline"
          onClick={() => router.push("/dashboard/user/exam")}
        >
          View all
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {exams.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-4">
            <p className="text-default-500">No exam found</p>
          </div>
        ) : (
          exams.map((exam: IExam) => (
            <Card
              key={exam.id}
              isPressable
              onPress={() => router.push(`/dashboard/user/exam/${exam.id}`)}
              className="overflow-hidden"
            >
              <CardHeader className="flex flex-col items-start gap-2 p-4">
                <div className="flex w-full items-start justify-between">
                  <h3 className="text-md line-clamp-2 font-semibold">
                    {exam.title}
                  </h3>
                  <Chip
                    size="sm"
                    color={getDifficultyColor(exam.difficulty)}
                    variant="flat"
                  >
                    {exam.difficulty}
                  </Chip>
                </div>
                <p className="text-small text-default-500 line-clamp-1">
                  {exam.category}
                </p>
              </CardHeader>
              <Divider />
              <CardFooter className="flex flex-col gap-2 p-4">
                <div className="text-small flex w-full justify-between">
                  <span className="text-default-500">Questions:</span>
                  <span className="font-semibold">{exam.total_questions}</span>
                </div>
                <div className="text-small flex w-full justify-between">
                  <span className="text-default-500">Duration:</span>
                  <span className="font-semibold">{exam.duration} min</span>
                </div>
                <div className="text-small flex w-full justify-between">
                  <span className="text-default-500">Passing:</span>
                  <span className="font-semibold">{exam.passing_score}%</span>
                </div>
                <Button
                  color="primary"
                  size="sm"
                  className="mt-2 w-full"
                  onPress={() => router.push(`/dashboard/user/exam/${exam.id}`)}
                >
                  Start Exam
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyExam;
