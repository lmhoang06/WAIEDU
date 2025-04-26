import React, { useState, useEffect } from 'react';
import { FormContainer, FormInput, FormButton } from '../../components/auth/FormComponents';
import { authService } from '../../services/auth';
import '../../styles/auth.css';

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Extract token from URL
    const queryParams = new URLSearchParams(window.location.search);
    const tokenParam = queryParams.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear field-specific error when user types
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu mới.');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // Get token from URL query parameter
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      
      if (!token) {
        throw new Error('Token không hợp lệ.');
      }
      
      const response = await authService.resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      if (response) {
        // Show success message
        setSuccess(true);
      } else {
        throw new Error('Đặt lại mật khẩu thất bại.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <FormContainer 
        title="Reset Password" 
        subtitle="Create a new password for your account"
        onSubmit={handleSubmit}
      >
        {error && <div className="error-message">{error}</div>}
        
        {success ? (
          <div className="success-message">
            <h3>Password Reset Successfully</h3>
            <p>Your password has been reset. You can now login with your new password.</p>
            <FormButton 
              text="Go to Login" 
              onClick={() => window.location.href = '/auth/login'}
            />
          </div>
        ) : (
          <>
            <FormInput
              id="password"
              type="password"
              label="New Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              error={errors.password}
            />
            
            <FormInput
              id="confirmPassword"
              type="password"
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              error={errors.confirmPassword}
            />
            
            <FormButton 
              text={loading ? "Resetting..." : "Reset Password"} 
              disabled={loading || !token}
            />
          </>
        )}
      </FormContainer>
    </div>
  );
};

export default ResetPassword;