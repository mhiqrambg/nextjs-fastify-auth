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
  Hash,
  BookOpen,
  ChevronRight,
  ListChecks,
} from "lucide-react";
import { useRouter } from "next/router";
import { useExam } from "@/hooks/exam/useExams";
import { IQuestion } from "@/types/Exam";

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h} jam ${m} menit` : `${m} menit`;
};

const ExamDetail = ({ id }: { id: string }) => {
  const { data, isLoading } = useExam(id);
  const router = useRouter();

  const exam = data?.exam;
  const questions = data?.questions ?? [];
  const totalQuestions = questions.length;

  const startExamPath = exam ? `/start/exam/${exam.id}` : "#";

  // Loading
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-5 p-4 md:p-8">
        <Skeleton className="h-8 w-3/4 rounded-lg" />
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-6 w-28 rounded-md" />
              </div>
            ))}
          </div>
        </Card>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-default-500 p-8 text-center">
        Data ujian tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      {/* Title */}
      <div className="mb-6 text-center">
        <h1 className="mb-1 text-2xl font-semibold">{exam.title}</h1>
        <p className="text-default-500">Kelas: {exam.classroom_name}</p>
      </div>

      {/* Summary */}
      <Card className="mb-8 shadow-sm">
        <CardHeader className="flex items-center gap-2 px-5 py-4">
          <BookOpen className="text-primary h-5 w-5" />
          <h2 className="text-base font-medium">Ringkasan Ujian</h2>
        </CardHeader>
        <Divider />
        <CardBody className="grid grid-cols-2 gap-x-6 gap-y-4 px-5 py-4 md:grid-cols-4">
          <div>
            <Chip
              size="sm"
              variant="flat"
              startContent={<Clock className="h-4 w-4" />}
              color="primary"
              className="mb-1"
            >
              Durasi
            </Chip>
            <p className="text-lg font-semibold">
              {formatDuration(exam.duration_minutes)}
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
              Total Soal
            </Chip>
            <p className="text-lg font-semibold">{totalQuestions} soal</p>
          </div>
          <div>
            <Chip
              size="sm"
              variant="flat"
              startContent={<CheckCircle className="h-4 w-4" />}
              color="success"
              className="mb-1"
            >
              Nilai Lulus
            </Chip>
            <p className="text-lg font-semibold">{exam.passing_score}</p>
          </div>
          <div>
            <Chip
              size="sm"
              variant="flat"
              startContent={<Hash className="h-4 w-4" />}
              className="mb-1"
            >
              Kode
            </Chip>
            <p className="text-lg font-semibold tracking-wider">{exam.code}</p>
          </div>
        </CardBody>
      </Card>

      {/* Questions preview */}
      <div className="space-y-3">
        <h3 className="mb-2 border-b pb-2 text-lg font-semibold">
          Pratinjau Soal {totalQuestions ? `(${totalQuestions})` : ""}
        </h3>

        {totalQuestions === 0 ? (
          <Card className="p-4 shadow-sm">
            <p className="text-default-500">Belum ada soal untuk ujian ini.</p>
          </Card>
        ) : (
          questions.map((q: IQuestion, idx: number) => (
            <Card key={q.id} className="p-4 shadow-sm">
              <p className="text-primary-500 mb-1 text-xs font-medium">
                Soal {idx + 1}
              </p>
              <p className="text-default-700 line-clamp-2 text-sm">
                {q.question}
              </p>
            </Card>
          ))
        )}
      </div>

      <Divider className="my-8" />

      {/* CTA */}
      <div className="text-center">
        <p className="text-default-600 mb-3 text-sm">
          Waktu yang tersedia:{" "}
          <span className="font-medium">
            {formatDuration(exam.duration_minutes)}
          </span>
          {totalQuestions ? (
            <>
              {" "}
              • Jumlah soal:{" "}
              <span className="font-medium">{totalQuestions}</span>
            </>
          ) : null}
        </p>
        <Button
          color="primary"
          size="md"
          endContent={<ChevronRight className="h-5 w-5" />}
          onPress={() => router.push(startExamPath)}
          isDisabled={!totalQuestions}
        >
          Mulai Ujian
        </Button>
      </div>
    </div>
  );
};

export default ExamDetail;
