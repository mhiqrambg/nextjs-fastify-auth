export interface IClassroom {
  id: string;
  name: string;
  description?: string;
  code: string;
  image_url?: string;
  teacher_id: string;
  is_active: boolean;
  max_students: number;
  created_at: string;
  updated_at: string;
}

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
