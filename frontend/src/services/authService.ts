import api from './api';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ForgotPasswordData,
  VerifyOTPData,
  ResetPasswordData,
  ApiResponse,
  User,
} from '../types';

// Register new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

// Logout user
export const logout = async (): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>('/auth/logout');
  return response.data;
};

// Logout from all devices
export const logoutAll = async (): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>('/auth/logout-all');
  return response.data;
};

// Refresh access token
export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
  return response.data.data!;
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
  return response.data.data!.user;
};

// Forgot password - send OTP
export const forgotPassword = async (data: ForgotPasswordData): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>('/auth/forgot-password', data);
  return response.data;
};

// Verify OTP
export const verifyOTP = async (data: VerifyOTPData): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>('/auth/verify-otp', data);
  return response.data;
};

// Reset password
export const resetPassword = async (data: ResetPasswordData): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>('/auth/reset-password', data);
  return response.data;
};
