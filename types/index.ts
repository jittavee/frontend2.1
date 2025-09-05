// client/types/index.ts
export interface User {
  id: string;
  username: string;
  email: string; // เพิ่ม email
  firstName: string;
  lastName: string;
  phone?: string | null;
  address?: string | null;
  profileImageUrl?: string | null;
  createdAt: string; // Prisma ส่งมาเป็น string
  updatedAt: string; // Prisma ส่งมาเป็น string
  education?: string | null;
  experience?: string | null;
  skills?: string | null;
}

export interface JobCategory {
  id: string;
  name: string;
}

// Type สำหรับหน้าแสดงรายการ (List View)
export interface JobPostSummary {
  id: string;
  title: string;
  imageUrl?: string | null;
  duration?: string | null;
  budget?: number | null; // เปลี่ยนเป็น number หรือ null
  location?: string | null;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  author: { id: string; username: string };
  category: JobCategory;
  _count: {
    applications: number;
    comments: number;
  };
}

// Type สำหรับหน้าแสดงรายละเอียด (Detail View)
export interface JobPostDetails extends Omit<JobPostSummary, '_count'> {
  description: string;
  author: User;
  applications: JobApplication[];
}

export interface JobApplication {
  id: string;
  applicant: { id: string; username: string };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: User;
}