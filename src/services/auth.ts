import { 
  LoginCredentials, 
  RegisterCredentials,
  ResetPasswordData,
  ForgotPasswordData,
  VerifyEmailCredentials,
  AuthResponse 
} from '../types/auth/index';

// const API_URL = 'https://guides.viegrand.site/api';
// const API_URL = 'http://localhost:5000/main'; // Localhost for development
const API_URL = import.meta.env.VITE_API_URL;

// Actual API service using fetch
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Password reset failed');
      }

      return responseData.success;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Password reset request failed');
      }

      return responseData.success;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async verifyEmail(credentials: VerifyEmailCredentials): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email verification failed');
      }

      return data.success;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Just remove token and user from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
