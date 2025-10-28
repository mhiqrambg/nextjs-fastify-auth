export type TClassroom = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  code: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  teacher_id: string;
  teacher_name: string;
  teacher_email: string;
  teacher_image_url: string | null;
};

export type ICreateClassroomInput = {
  name: string;
  description: string;
  imageFile: File | null;
};

export interface ICreateClassroomForm {
  name: string;
  description: string;
  imageFile: File | null;
}

export type TClassroomMember = {
  member_id: string;
  member_name: string;
  member_email: string;
  member_image_url: string | null;
};

export type TClassroomExam = {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  passing_score: number;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export interface IClassroomMember {
  id: string;
  classroom_id: string;
  user_id: string;
  role: "student" | "assistant";
  joined_at: string;
  progress: number;
}

export interface IClassroomExam {
  id: string;
  classroom_id: string;
  exam_id: string;
  assigned_at: string;
  due_date?: string;
  is_required: boolean;
}

export interface ICreateClassroomInput {
  name: string;
  description?: string;
  image_url?: string;
  max_students?: number;
}

export interface IUpdateClassroomInput {
  name?: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  max_students?: number;
}

export interface IJoinClassroomInput {
  code: string;
}

export interface IAddMemberInput {
  classroom_id: string;
  user_id: string;
  role?: "student" | "assistant";
}

export interface IUpdateMemberProgressInput {
  classroom_id: string;
  progress: number;
}

export interface IAssignExamInput {
  classroom_id: string;
  exam_id: string;
  due_date?: string;
  is_required?: boolean;
}

export interface IUnassignExamInput {
  classroom_id: string;
  exam_id: string;
}

export interface IClassroomWithDetails extends IClassroom {
  member_count?: number;
  exam_count?: number;
  teacher_name?: string;
}

export type ClassroomListResponse = {
  data: IClassroom[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};
