import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { authService } from '../../services/auth';
import loginImage from '../../assets/images/login-illustration.svg';
import '../../styles/auth.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check for saved email if remember me was used previously
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberUser');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when typing
    if (error) setError(null);
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
      
      // If remember me is checked, store user preference
      if (rememberMe) {
        localStorage.setItem('rememberUser', formData.email);
      } else {
        localStorage.removeItem('rememberUser');
      }
      
      // Redirect to dashboard or home page after successful login
      window.location.href = '/dashboard';
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout backgroundImage={loginImage}>
      <div className="auth-form-container">
        <h1 className="auth-title">Đăng nhập vào WAIEDU</h1>
        <p className="auth-subtitle">Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục.</p>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                id="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu của bạn"
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="form-extras">
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
            </div>
            
            <div className="forgot-password">
              <Link to="/auth/forgot-password">Quên mật khẩu?</Link>
            </div>
          </div>
          
          <button 
            type="submit"
            className="form-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" stroke="currentColor" strokeDasharray="32" strokeDashoffset="32">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
                  </circle>
                </svg>
                <span style={{ marginLeft: '8px' }}>Đang đăng nhập...</span>
              </>
            ) : "Đăng nhập"}
          </button>
        </form>
        
        <div className="form-divider">
          <span>hoặc đăng nhập với</span>
        </div>
        
        <div className="social-login">
          <button className="social-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#4285F4">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
            </svg>
            Google
          </button>
          <button className="social-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-5.8-4.698-10.5-10.498-10.5s-10.5 4.7-10.5 10.5c0 5.243 3.84 9.583 8.86 10.37v-7.337h-2.668v-3.033h2.668V9.74c0-2.633 1.568-4.085 3.966-4.085 1.15 0 2.35.205 2.35.205v2.584h-1.322c-1.304 0-1.712.81-1.712 1.64v1.97h2.912l-.465 3.032H16.14v7.337c5.02-.787 8.86-5.127 8.86-10.37"/>
            </svg>
            Facebook
          </button>
        </div>
        
        <div className="form-link">
          Chưa có tài khoản? <Link to="/auth/register">Đăng ký ngay</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;