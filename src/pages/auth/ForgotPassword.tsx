import React, { useState } from 'react';
import { FormContainer, FormInput, FormButton, FormLink } from '../../components/auth/FormComponents';
import { authService } from '../../services/auth';
import '../../styles/auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !validateEmail(email)) {
      setError('Vui lòng nhập email hợp lệ.');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const response = await authService.forgotPassword({
        email
      });
      
      if (response) {
        // Show success message
        setSuccess(true);
      } else {
        throw new Error('Yêu cầu đặt lại mật khẩu thất bại.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <FormContainer 
        title="Forgot Password" 
        subtitle="Enter your email and we'll send you a reset link"
        onSubmit={handleSubmit}
      >
        {error && <div className="error-message">{error}</div>}
        
        {success ? (
          <div className="success-message">
            <h3>Check your email</h3>
            <p>We've sent a password reset link to {email}</p>
            <FormButton 
              text="Back to Login" 
              onClick={() => window.location.href = '/auth/login'}
            />
          </div>
        ) : (
          <>
            <FormInput
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
            
            <FormButton 
              text={loading ? "Sending..." : "Reset Password"} 
              disabled={loading}
            />
            
            <FormLink
              text="Remembered your password?"
              linkText="Back to Login"
              to="/auth/login"
            />
          </>
        )}
      </FormContainer>
    </div>
  );
};

export default ForgotPassword;