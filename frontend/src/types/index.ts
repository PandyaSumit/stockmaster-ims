// User types
export type UserRole = 'Admin' | 'Inventory Manager' | 'Warehouse Staff';

export interface User {
  id: string;
  loginId: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin?: Date;
  createdAt?: Date;
}

// Auth types
export interface LoginCredentials {
  loginId: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  loginId: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    accessToken: string;
  };
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Theme types
export type Theme = 'light' | 'dark';
