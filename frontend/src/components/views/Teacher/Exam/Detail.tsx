import { useDeleteExam, useExam } from "@/hooks/exam/useExams";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Skeleton,
} from "@heroui/react";
import {
  Clock,
  CheckCircle,
  ListChecks,
  Hash,
  Users,
  BookOpen,
  Edit,
  Trash,
  Eye,
  Timer,
} from "lucide-react";
import { useRouter } from "next/router";
import { IExam, IExamAttempt, IQuestion } from "@/types/Exam";
import { ExamQuestions } from "@/components/views/Teacher/Exam";
import ParticipantStatus from "./Participant";
import { formatDate, formatDuration } from "@/utils/date";

export default function ExamDetailTeacher({ id }: { id: string }) {
  const { data, isLoading } = useExam(id);

  console.log("data", data);
  const deleteMutation = useDeleteExam();
  const router = useRouter();

  const exam = data as IExam;
  const questions = data?.questions ?? [];
  const attempts = data?.attempts ?? [];

  console.log("exam", exam);
  console.log("questions", questions);
  console.log("attempts", attempts);

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the exam: ${exam?.title}?`,
      )
    ) {
      deleteMutation.mutate(exam?.id ?? "");
      router.push("/dashboard/teacher/exams");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
        <Skeleton className="h-8 w-3/4 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-default-800 mb-1 text-3xl font-bold">
          {exam?.title}
        </h1>
        <p className="text-default-500">
          Class: {exam?.classroom_name} • Created {formatDate(exam?.created_at)}
        </p>
      </div>

      {/* Summary */}
      <Card className="shadow-sm">
        <CardHeader className="flex items-center gap-2 px-6 pt-5 pb-3">
          <BookOpen className="text-primary h-5 w-5" />
          <h2 className="text-base font-semibold">Exam Summary</h2>
        </CardHeader>
        <Divider />
        <CardBody className="grid grid-cols-2 gap-x-6 gap-y-4 p-6 md:grid-cols-4">
          <div>
            <Chip
              size="sm"
              variant="flat"
              startContent={<Clock className="h-4 w-4" />}
              color="primary"
              className="mb-1"
            >
              Duration
            </Chip>
            <p className="text-lg font-semibold">
              {formatDuration(exam?.duration_minutes ?? 0)}
            </p>
          </div>
          <div>
            <Chip
              size="sm"
              variant="flat"
              startContent={<ListChecks className="h-4 w-4" />}
              color="secondary"
              className="mb-1"
            >
              Total Questions
            </Chip>
            <p className="text-lg font-semibold">
              {data?.questions?.length ?? 0} Questions
            </p>
          </div>
          <div>
            <Chip
              size="sm"
              variant="flat"
              startContent={<CheckCircle className="h-4 w-4" />}
              color="success"
              className="mb-1"
            >
              Passing Score
            </Chip>
            <p className="text-lg font-semibold">{exam?.passing_score ?? 0}</p>
          </div>
          <div>
            <Chip
              size="sm"
              variant="flat"
              startContent={<Hash className="h-4 w-4" />}
              className="mb-1"
            >
              Code
            </Chip>
            <p className="text-lg font-semibold tracking-wider">
              {exam?.code ?? ""}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Attempts Section */}
      <ParticipantStatus attempts={attempts} />

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        {/* <Button
          startContent={<Eye className="h-4 w-4" />}
          variant="flat"
          onPress={() => router.push(`/dashboard/user/exam/${exam?.id ?? ""}`)}
        >
          Preview Exam
        </Button> */}
        <Button
          color="primary"
          variant="flat"
          startContent={<Edit className="h-4 w-4" />}
          onPress={() =>
            router.push(`/dashboard/teacher/exams/${exam?.id ?? ""}/edit`)
          }
        >
          Edit
        </Button>
        <Button
          color="danger"
          startContent={<Trash className="h-4 w-4" />}
          variant="flat"
          onPress={handleDelete}
        >
          Delete
        </Button>
      </div>

      {/* Questions */}
      <ExamQuestions questions={questions as IQuestion[]} />
    </div>
  );
}
