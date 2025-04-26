import { 
  LoginCredentials, 
  RegisterCredentials, 
  ForgotPasswordCredentials, 
  ResetPasswordCredentials,
  AuthResponse 
} from '../../types/auth';

// Mock API URL - replace with your actual API endpoint in production
const API_URL = '/api';

// Helper for fetch requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // In a real application, this would be an API call
    // For now, we'll mock a successful response
    try {
      const response = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      // Store token in localStorage for persistence
      localStorage.setItem('token', response.token);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  register: async (userData: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      // Store token in localStorage for persistence
      localStorage.setItem('token', response.token);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordCredentials): Promise<{ message: string }> => {
    try {
      return await fetchWithAuth('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (data: ResetPasswordCredentials): Promise<{ message: string }> => {
    try {
      return await fetchWithAuth('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};