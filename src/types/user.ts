
// ============================================
// User Management Types
// ============================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'hr' | 'director' | 'staff';
  is_active: boolean;
  department_id: string | null;
  designation_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Designation {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface UserFormData {
  email: string;
  full_name: string;
  role: User['role'];
  department_id: string | null;
  designation_id: string | null;
  is_active: boolean;
}

export interface UserFilters {
  search: string;
  role?: User['role'];
  status?: 'active' | 'inactive';
  department_id?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}