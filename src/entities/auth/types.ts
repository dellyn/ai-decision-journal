import { ApiError } from "@/shared/api/error-handler";

export interface AuthFormData {
  email: string;
  password: string;
}

export interface SignUpFormData extends AuthFormData {
  repeatPassword: string;
}

export interface AuthState {
  isLoading: boolean;
  error: ApiError | null;
} 