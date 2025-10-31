import { TClassroomExam } from "@/types/Classroom";
import { Button, Card, CardBody, Skeleton } from "@heroui/react";
import { formatDate } from "@/utils/date";
import { useRouter } from "next/router";

const TExams = ({
  isExamsLoading,
  isExamsFetching,
  exams,
}: {
  isExamsLoading: boolean;
  isExamsFetching: boolean;
  exams: TClassroomExam[];
}) => {
  const router = useRouter();
  return (
    <Card className="shadow-sm">
      <CardBody>
        {isExamsLoading || isExamsFetching ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : exams && exams.length > 0 ? (
          <div className="flex flex-col gap-2">
            {exams.map((exam: TClassroomExam) => (
              <div
                key={exam.id}
                className="border-default-200 flex items-center justify-between gap-2 rounded-xl border p-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1 leading-tight">
                    <span className="font-medium capitalize">{exam.title}</span>
                    <span className="text-default-500 text-xs"></span>
                    <span className="text-default-500 text-xs">
                      {formatDate(exam.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="bordered"
                    color="primary"
                    onPress={() =>
                      router.push(`/dashboard/teacher/exams/${exam.id}`)
                    }
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-default-500">No exams found for this class.</p>
        )}
      </CardBody>
    </Card>
  );
};

export default TExams;
