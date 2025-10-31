export const transformExamDetail = (flatRows: any[]): any | null => {
  if (flatRows.length === 0) return null;

  const examData = flatRows[0];
  const questionMap = new Map<string, any>();

  const examDetail: any = {
    id: examData.exam_id,
    title: examData.exam_title,
    description: examData.description,
    duration_minutes: examData.duration_minutes,
    passing_score: examData.passing_score,
    classroom_name: examData.classroom_name,
    created_at: examData.created_at,
    updated_at: examData.updated_at,
    code: examData.exam_code,
    questions: [],
  };

  for (const row of flatRows) {
    const questionId = row.question_id;

    if (!questionMap.has(questionId)) {
      const newQuestion: any = {
        id: questionId,
        text: row.question_text,
        order: row.question_order,
        options: [],
      };
      questionMap.set(questionId, newQuestion);
      examDetail.questions.push(newQuestion);
    }

    if (row.option_id) {
      const currentQuestion = questionMap.get(questionId)!;
      currentQuestion.options.push({
        id: row.option_id,
        text: row.option_text!,
        is_correct: row.is_correct!,
      });
    }
  }

  return examDetail;
};
