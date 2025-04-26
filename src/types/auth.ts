export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  // Account details
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  
  // Personal information
  phone?: string;
  birthDate?: string;
  gender?: string;
  
  // Educational preferences
  role?: string;
  grade?: string;
  school?: string;
  interestedSubjects?: string[];
}

export interface ResetPasswordCredentials {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordCredentials {
  email: string;
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

export interface AuthResponse {
  user: User;
  token: string;
}
