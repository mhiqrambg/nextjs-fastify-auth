import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { Users, MinusCircle, CheckCircle2, Clock } from "lucide-react";
import { useMemo } from "react";

interface IExamAttempt {
  status: "in_progress" | "completed" | "abandoned" | "timed_out" | string;
}

export default function ParticipantStatus({
  attempts,
}: {
  attempts: IExamAttempt[] | undefined;
}) {
  const { total, inProgress, completed, notStarted } = useMemo(() => {
    const list = Array.isArray(attempts) ? attempts : [];
    const total = list.length;
    const inProgress = list.filter((a) => a.status === "in_progress").length;
    const completed = list.filter((a) => a.status === "completed").length;
    const notStarted = total - (inProgress + completed);
    return { total, inProgress, completed, notStarted };
  }, [attempts]);

  const hasNoData = (attempts?.length ?? 0) === 0;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex items-center gap-2 px-6 pt-5 pb-3">
        <Users className="text-primary h-5 w-5" />
        <h2 className="text-default-800 text-base font-semibold">
          Participant Status
        </h2>
      </CardHeader>
      <Divider />
      <CardBody className="p-6">
        {hasNoData ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="bg-default-100 rounded-full p-3">
              <Users className="text-default-500 h-6 w-6" />
            </div>
            <p className="text-default-800 font-medium">
              No participant has started the exam.
            </p>
            <p className="text-default-500 text-sm">
              Undang peserta atau mulai ujian untuk melihat statistik.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SoftStat
              icon={<Users className="text-default-500 h-4 w-4" />}
              label="Total Participant"
              value={total}
            />
            <SoftStat
              icon={<Clock className="text-default-500 h-4 w-4" />}
              label="In Progress"
              value={inProgress}
            />
            <SoftStat
              icon={<CheckCircle2 className="text-default-500 h-4 w-4" />}
              label="Completed"
              value={completed}
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/** Soft & minimal stat card */
function SoftStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border-default-200 bg-default-50/30 hover:bg-default-100/40 rounded-xl border p-4 transition-colors">
      <div className="flex items-center justify-center gap-2">
        {icon}
        <p className="text-default-500 text-sm">{label}</p>
      </div>
      <p className="text-default-800 mt-2 text-center text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}
