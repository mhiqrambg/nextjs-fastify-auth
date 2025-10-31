// components/exam/ExamQuestions.tsx
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Accordion,
  AccordionItem,
  Chip,
  Spacer,
  Button,
} from "@heroui/react";
import { ClipboardList, Timer, Search, Plus } from "lucide-react";
import { IQuestion } from "@/types/Exam";

function alphaLabel(index: number) {
  return String.fromCharCode(65 + index);
}

// Fallback aman untuk teks soal (UI menerima data yang belum dinormalisasi)
function getQuestionText(q: any): string {
  const raw = (q?.question ?? q?.text ?? "").toString();
  return raw.trim();
}

// Fallback aman untuk urutan
function getOrderNumber(q: any, i: number): number {
  if (typeof q?.order_num === "number") return q.order_num + 1;
  if (typeof q?.order === "number") return q.order + 1;
  return i + 1;
}

export default function ExamQuestions({
  questions,
}: {
  questions: IQuestion[];
}) {
  const safeQuestions = Array.isArray(questions) ? questions : [];

  const filtered = safeQuestions.filter((q) => {
    const hasText = getQuestionText(q).length > 0;
    const hasOptions = Array.isArray(q?.options) && q.options.length > 0;
    return hasText || hasOptions;
  });

  const hasNoQuestions = filtered.length === 0;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex items-center gap-2 px-6 pt-5 pb-3">
        <Timer className="text-primary h-5 w-5" />
        <h2 className="text-base font-semibold">Questions</h2>
        <Button
          isIconOnly
          variant="light"
          className="hover:bg-transparent hover:opacity-100"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          isIconOnly
          variant="light"
          className="w-full justify-end hover:bg-transparent hover:opacity-100"
        >
          <Search className="h-4 w-4" />
        </Button>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-2">
        {hasNoQuestions ? (
          <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
            <div className="bg-default-100 rounded-full p-3">
              <ClipboardList className="text-default-500 h-6 w-6" />
            </div>
            <p className="text-default-800 font-medium">No questions found</p>
            <p className="text-default-500 text-sm">
              Belum ada soal untuk ujian ini. Silakan kembali nanti.
            </p>
          </div>
        ) : (
          <Accordion
            variant="splitted"
            selectionMode="multiple"
            itemClasses={{
              base: "px-4 md:px-6",
              content: "pt-2 pb-4",
              title: "text-default-800",
              subtitle: "text-default-500",
              indicator: "text-default-400",
            }}
          >
            {filtered.map((q, i) => {
              const labelNumber = getOrderNumber(q, i);
              const titleText = getQuestionText(q);

              return (
                /*Questions */
                <AccordionItem
                  key={q.id ?? `q-${i}`}
                  aria-label={`Question ${labelNumber}`}
                  title={
                    <div className="mb-2 flex items-center gap-2">
                      <Chip size="sm" className="bg-primary/10 text-primary">
                        Q{labelNumber}
                      </Chip>
                      <span className="text-sm font-medium">
                        Question {labelNumber}
                      </span>
                    </div>
                  }
                  subtitle={
                    <span className="text-default-700">{titleText || "-"}</span>
                  }
                >
                  {/* Options */}
                  <div className="space-y-3">
                    <Divider className="opacity-70" />

                    {(q.options?.length ?? 0) > 0 ? (
                      <ol className="space-y-2">
                        {q.options!.map((opt: any, idx: number) => {
                          const isCorrect = opt.is_correct === true;

                          return (
                            <li
                              key={opt.id ?? `opt-${i}-${idx}`}
                              className={`flex items-start gap-3 rounded-lg border px-3 py-2 transition-colors ${
                                isCorrect
                                  ? "border-success-200 bg-success-50/60 dark:bg-success-100/10"
                                  : "hover:bg-default-50 border-default-200"
                              } `}
                            >
                              <span
                                className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${
                                  isCorrect
                                    ? "bg-success-100 text-success-700 dark:bg-success-200/20 dark:text-success-400"
                                    : "bg-default-100 text-default-600"
                                }`}
                              >
                                {alphaLabel(idx)}
                              </span>

                              <span className="text-default-700 flex-1">
                                {opt.text}
                              </span>

                              {isCorrect && (
                                <span className="text-success-600 flex items-center gap-1 text-sm font-medium">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-4 w-4"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Correct
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <p className="text-default-400 text-sm">No options.</p>
                    )}

                    <Spacer y={1} />
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardBody>
    </Card>
  );
}
