export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  // Add additional fields for registration
  phone?: string;
  birthDate?: string;
  gender?: string;
  role?: string;
  grade?: string;
  school?: string;
  interestedSubjects?: string[];
  // Add the new role-specific fields
  teachingSubject?: string;
  childGrade?: string;
}

// Rename to match what the service imports
export interface ForgotPasswordData {
  email: string;
}

// Aliases for compatibility
export interface ForgotPasswordCredentials extends ForgotPasswordData {}

// Rename to match what the service imports
export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
  token: string;
}

// Aliases for compatibility
export interface ResetPasswordCredentials extends ResetPasswordData {}

// Add missing interface
export interface VerifyEmailCredentials {
  token: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}