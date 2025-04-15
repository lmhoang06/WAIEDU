import { 
  LoginCredentials, 
  RegisterCredentials,
  ResetPasswordData,
  ForgotPasswordData,
  VerifyEmailCredentials,
  AuthResponse 
} from '../types/auth/index'; // Specify exact path to auth/index.ts

// Mock API service - replace with actual API calls later
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Dummy validation for example
        if (credentials.email && credentials.password) {
          resolve({
            user: {
              id: '1',
              name: 'Test User',
              email: credentials.email,
              role: 'student',
              isVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            token: 'dummy-jwt-token'
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          // Use the credentials in the response
          resolve({
            user: {
              id: '1',
              name: credentials.name,
              email: credentials.email,
              role: credentials.role || 'student',
              isVerified: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            token: 'dummy-jwt-token'
          });
        } else {
          reject(new Error('Registration failed'));
        }
      }, 1000);
    });
  }

  async resetPassword(credentials: ResetPasswordData): Promise<boolean> {
    // Simulate API call and use the credentials
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.password === credentials.confirmPassword && credentials.token) {
          resolve(true);
        } else {
          reject(new Error('Password reset failed'));
        }
      }, 1000);
    });
  }

  async forgotPassword(credentials: ForgotPasswordData): Promise<boolean> {
    // Simulate API call and use the credentials
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email) {
          resolve(true);
        } else {
          reject(new Error('Email is required'));
        }
      }, 1000);
    });
  }

  async verifyEmail(credentials: VerifyEmailCredentials): Promise<boolean> {
    // Simulate API call and use the credentials
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.token) {
          resolve(true);
        } else {
          reject(new Error('Token is required'));
        }
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    // Logout logic here
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
