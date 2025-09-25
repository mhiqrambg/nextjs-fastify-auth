import { IExam, IQuestion, IExamAttempt, IExamResult } from "@/types/Exam";

// Mock data for exams
const mockExams: IExam[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description:
      "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
    duration: 30,
    totalQuestions: 10,
    passingScore: 70,
    difficulty: "easy",
    category: "Programming",
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "React Advanced Concepts",
    description:
      "Advanced React concepts including hooks, context, performance optimization, and testing.",
    duration: 45,
    totalQuestions: 15,
    passingScore: 75,
    difficulty: "hard",
    category: "Frontend Development",
    isActive: true,
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "3",
    title: "TypeScript Essentials",
    description:
      "Learn TypeScript fundamentals including types, interfaces, generics, and advanced patterns.",
    duration: 40,
    totalQuestions: 12,
    passingScore: 70,
    difficulty: "medium",
    category: "Programming",
    isActive: true,
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z",
  },
  {
    id: "4",
    title: "Database Design Principles",
    description:
      "Understand database design, normalization, relationships, and SQL optimization.",
    duration: 60,
    totalQuestions: 20,
    passingScore: 80,
    difficulty: "hard",
    category: "Database",
    isActive: true,
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "5",
    title: "Web Security Basics",
    description:
      "Learn about common web vulnerabilities, authentication, and security best practices.",
    duration: 35,
    totalQuestions: 14,
    passingScore: 75,
    difficulty: "medium",
    category: "Security",
    isActive: true,
    createdAt: "2024-01-19T10:00:00Z",
    updatedAt: "2024-01-19T10:00:00Z",
  },
];

// Mock questions for all exams
const mockQuestions: Record<string, IQuestion[]> = {
  "1": [
    {
      id: "q1",
      examId: "1",
      question:
        "Which of the following is the correct way to declare a variable in JavaScript?",
      options: [
        { id: "a", text: "var myVar = 10;", value: "a" },
        { id: "b", text: "variable myVar = 10;", value: "b" },
        { id: "c", text: "v myVar = 10;", value: "c" },
        { id: "d", text: "declare myVar = 10;", value: "d" },
      ],
      correctAnswer: "a",
      explanation:
        'The "var" keyword is used to declare variables in JavaScript.',
      points: 10,
      order: 1,
    },
    {
      id: "q2",
      examId: "1",
      question: "What will be the output of: console.log(typeof null)?",
      options: [
        { id: "a", text: "null", value: "a" },
        { id: "b", text: "undefined", value: "b" },
        { id: "c", text: "object", value: "c" },
        { id: "d", text: "string", value: "d" },
      ],
      correctAnswer: "c",
      explanation:
        'This is a known quirk in JavaScript where typeof null returns "object".',
      points: 10,
      order: 2,
    },
    {
      id: "q3",
      examId: "1",
      question:
        "Which method is used to add an element to the end of an array?",
      options: [
        { id: "a", text: "push()", value: "a" },
        { id: "b", text: "pop()", value: "b" },
        { id: "c", text: "shift()", value: "c" },
        { id: "d", text: "unshift()", value: "d" },
      ],
      correctAnswer: "a",
      explanation:
        "The push() method adds one or more elements to the end of an array.",
      points: 10,
      order: 3,
    },
    {
      id: "q4",
      examId: "1",
      question: "What is the correct syntax for a JavaScript function?",
      options: [
        { id: "a", text: "function = myFunction() {}", value: "a" },
        { id: "b", text: "function myFunction() {}", value: "b" },
        { id: "c", text: "create myFunction() {}", value: "c" },
        { id: "d", text: "function:myFunction() {}", value: "d" },
      ],
      correctAnswer: "b",
      explanation:
        'Functions in JavaScript are declared using the "function" keyword followed by the function name.',
      points: 10,
      order: 4,
    },
    {
      id: "q5",
      examId: "1",
      question:
        "Which operator is used for strict equality comparison in JavaScript?",
      options: [
        { id: "a", text: "==", value: "a" },
        { id: "b", text: "===", value: "b" },
        { id: "c", text: "=", value: "c" },
        { id: "d", text: "!=", value: "d" },
      ],
      correctAnswer: "b",
      explanation:
        "The === operator performs strict equality comparison without type coercion.",
      points: 10,
      order: 5,
    },
    {
      id: "q6",
      examId: "1",
      question: 'What will be the output of: console.log(1 + "2" + 3)?',
      options: [
        { id: "a", text: "6", value: "a" },
        { id: "b", text: "123", value: "b" },
        { id: "c", text: "15", value: "c" },
        { id: "d", text: "NaN", value: "d" },
      ],
      correctAnswer: "b",
      explanation:
        'JavaScript performs string concatenation from left to right: 1 + "2" = "12", then "12" + 3 = "123".',
      points: 10,
      order: 6,
    },
    {
      id: "q7",
      examId: "1",
      question:
        "Which method is used to remove the last element from an array?",
      options: [
        { id: "a", text: "pop()", value: "a" },
        { id: "b", text: "push()", value: "b" },
        { id: "c", text: "shift()", value: "c" },
        { id: "d", text: "slice()", value: "d" },
      ],
      correctAnswer: "a",
      explanation:
        "The pop() method removes and returns the last element from an array.",
      points: 10,
      order: 7,
    },
    {
      id: "q8",
      examId: "1",
      question: "What is the correct way to write a JavaScript comment?",
      options: [
        { id: "a", text: "<!-- This is a comment -->", value: "a" },
        { id: "b", text: "// This is a comment", value: "b" },
        { id: "c", text: "# This is a comment", value: "c" },
        { id: "d", text: "* This is a comment *", value: "d" },
      ],
      correctAnswer: "b",
      explanation: "Single-line comments in JavaScript start with //",
      points: 10,
      order: 8,
    },
    {
      id: "q9",
      examId: "1",
      question: "Which of the following is NOT a JavaScript data type?",
      options: [
        { id: "a", text: "string", value: "a" },
        { id: "b", text: "boolean", value: "b" },
        { id: "c", text: "float", value: "c" },
        { id: "d", text: "undefined", value: "d" },
      ],
      correctAnswer: "c",
      explanation:
        'JavaScript does not have a specific "float" data type. Numbers are represented as the "number" type.',
      points: 10,
      order: 9,
    },
    {
      id: "q10",
      examId: "1",
      question: 'What does the "this" keyword refer to in JavaScript?',
      options: [
        { id: "a", text: "The current function", value: "a" },
        { id: "b", text: "The global object", value: "b" },
        { id: "c", text: "The object that owns the code", value: "c" },
        { id: "d", text: "The previous object", value: "d" },
      ],
      correctAnswer: "c",
      explanation:
        'The "this" keyword refers to the object that owns the code being executed.',
      points: 10,
      order: 10,
    },
  ],
  // Mock questions for React Advanced Concepts
  "2": [
    {
      id: "r1",
      examId: "2",
      question: "What is the purpose of useEffect hook in React?",
      options: [
        { id: "a", text: "To manage component state", value: "a" },
        {
          id: "b",
          text: "To handle side effects in functional components",
          value: "b",
        },
        { id: "c", text: "To render JSX elements", value: "c" },
        { id: "d", text: "To create custom hooks", value: "d" },
      ],
      correctAnswer: "b",
      explanation:
        "useEffect is used to handle side effects in functional components.",
      points: 10,
      order: 1,
    },
    {
      id: "r2",
      examId: "2",
      question: "Which hook is used for managing complex state logic?",
      options: [
        { id: "a", text: "useState", value: "a" },
        { id: "b", text: "useEffect", value: "b" },
        { id: "c", text: "useReducer", value: "c" },
        { id: "d", text: "useMemo", value: "d" },
      ],
      correctAnswer: "c",
      explanation: "useReducer is preferred for managing complex state logic.",
      points: 10,
      order: 2,
    },
  ],
  // Mock questions for TypeScript Essentials
  "3": [
    {
      id: "t1",
      examId: "3",
      question: "What is the correct way to define an interface in TypeScript?",
      options: [
        { id: "a", text: "interface Person { name: string; }", value: "a" },
        { id: "b", text: "type Person = { name: string; }", value: "b" },
        { id: "c", text: "class Person { name: string; }", value: "c" },
        { id: "d", text: "Both A and B", value: "d" },
      ],
      correctAnswer: "d",
      explanation:
        "Both interface and type can be used to define object shapes in TypeScript.",
      points: 10,
      order: 1,
    },
  ],
  // Mock questions for Database Design
  "4": [
    {
      id: "d1",
      examId: "4",
      question: "What is the primary key in a database table?",
      options: [
        {
          id: "a",
          text: "A column that can contain duplicate values",
          value: "a",
        },
        {
          id: "b",
          text: "A column that uniquely identifies each row",
          value: "b",
        },
        { id: "c", text: "A column that can be null", value: "c" },
        { id: "d", text: "A column that stores foreign keys", value: "d" },
      ],
      correctAnswer: "b",
      explanation:
        "A primary key uniquely identifies each row in a database table.",
      points: 10,
      order: 1,
    },
  ],
  // Mock questions for Web Security
  "5": [
    {
      id: "s1",
      examId: "5",
      question: "What does XSS stand for in web security?",
      options: [
        { id: "a", text: "Cross-Site Scripting", value: "a" },
        { id: "b", text: "Cross-Site Security", value: "b" },
        { id: "c", text: "Extended Security System", value: "c" },
        { id: "d", text: "XML Security Standard", value: "d" },
      ],
      correctAnswer: "a",
      explanation:
        "XSS stands for Cross-Site Scripting, a common web vulnerability.",
      points: 10,
      order: 1,
    },
  ],
};

// Mock service functions
export const examService = {
  // Get all available exams
  getExams: async (): Promise<IExam[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockExams.filter((exam) => exam.isActive);
  },

  // Get exam by ID
  getExamById: async (id: string): Promise<IExam | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockExams.find((exam) => exam.id === id) || null;
  },

  // Get questions for an exam
  getExamQuestions: async (examId: string): Promise<IQuestion[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockQuestions[examId] || [];
  },

  // Start an exam attempt
  startExamAttempt: async (examId: string): Promise<IExamAttempt> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const exam = mockExams.find((e) => e.id === examId);
    if (!exam) throw new Error("Exam not found");

    const attempt: IExamAttempt = {
      id: `attempt_${Date.now()}`,
      examId,
      userId: "current_user", // In real app, get from auth context
      startTime: new Date().toISOString(),
      answers: [],
      status: "in_progress",
      timeRemaining: exam.duration * 60, // Convert minutes to seconds
    };

    return attempt;
  },

  // Submit exam attempt
  submitExamAttempt: async (
    attemptId: string,
    answers: Record<string, string>,
  ): Promise<IExamResult> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a real app, this would calculate the score based on correct answers
    const mockResult: IExamResult = {
      id: `result_${Date.now()}`,
      examAttemptId: attemptId,
      totalQuestions: 10,
      correctAnswers: Math.floor(Math.random() * 8) + 6, // Random score between 6-10
      score: 0,
      percentage: 0,
      passed: false,
      completedAt: new Date().toISOString(),
      timeTaken: 25,
      answers: [],
    };

    mockResult.score = mockResult.correctAnswers * 10;
    mockResult.percentage =
      (mockResult.correctAnswers / mockResult.totalQuestions) * 100;
    mockResult.passed = mockResult.percentage >= 70;

    return mockResult;
  },

  // Get exam results
  getExamResults: async (userId: string): Promise<IExamResult[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    // Return mock results - in real app, fetch from API
    return [];
  },
};
