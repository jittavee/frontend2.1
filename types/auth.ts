// client/types/auth.ts

/**
 * กำหนดโครงสร้างข้อมูลของผู้ใช้ที่ล็อกอินแล้ว
 * ซึ่งเป็นข้อมูลที่ได้มาจาก API และเก็บไว้ใน state
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phone?: string | null;
  address?: string | null;
  profileImageUrl?: string | null;
  // เพิ่ม field อื่นๆ ที่จำเป็นได้ตาม schema ของ Prisma
}

/**
 * กำหนดโครงสร้างของ State ที่จัดการโดย useAuth hook
 * เพื่อให้ TypeScript รู้ว่า hook นี้จะคืนค่าอะไรกลับมาบ้าง
 */
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  // อาจจะมีฟังก์ชันอื่นเพิ่มเติมในอนาคต เช่น:
  // login: (credentials: LoginCredentials) => Promise<void>;
  // checkAuth: () => Promise<void>;
}