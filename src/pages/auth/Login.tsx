import React, { useState } from 'react';
import { FormContainer, FormInput, FormButton, FormLink, FormDivider } from '../../components/auth/FormComponents';
import { authService } from '../../services/auth';
import '../../styles/auth.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await authService.login({
        email: formData.email,
        password: formData.password
      });
      
      // Redirect to dashboard or home page after successful login
      window.location.href = '/dashboard';
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <FormContainer 
        title="Login to WAIEDU" 
        subtitle="Welcome back! Please enter your details"
        onSubmit={handleSubmit}
      >
        {error && <div className="error-message">{error}</div>}
        
        <FormInput
          id="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        
        <FormInput
          id="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        
        <div className="forgot-password">
          <a href="/auth/forgot-password">Forgot password?</a>
        </div>
        
        <FormButton 
          text={loading ? "Logging in..." : "Login"} 
          disabled={loading}
        />
        
        <FormDivider />
        
        <FormLink
          text="Don't have an account?"
          linkText="Sign up"
          to="/auth/register"
        />
      </FormContainer>
    </div>
  );
};

export default Login;