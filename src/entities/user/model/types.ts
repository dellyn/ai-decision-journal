export interface User {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserResponse {
  user: User | null;
  error: Error | null;
}

